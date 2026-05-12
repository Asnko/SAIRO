import re
import requests
from xml.etree import ElementTree as ET
from django.conf import settings
from django.db import transaction
from .models import Course, CourseMeeting


def fetch_schkey() -> str:
    # 종합강의시간표 launch 페이지에서 SCHKEY 추출
    url = "https://h5.sch.ac.kr/html5/SCH/LaunchProject2.jsp"
    params = {"surl": "5d964dca78bd84efb9cc2166a8cd43a5b1bf78fa2e824f58"} # 아마 고정값일 듯. 추후 변경 가능성 있음 (아마?)
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "Referer": "https://st.sch.ac.kr/",
    }

    response = requests.get(url, params=params, headers=headers, timeout=10)
    response.raise_for_status()

    match = re.search(r'gv_schkey["\']?\s*,\s*["\']?([a-f0-9]+)', response.text) # SCHKEY 추출 regex
    if not match:
        raise ValueError("SCHKEY를 찾을 수 없습니다")
    return match.group(1)


def fetch_courses(year: int, smt: str) -> list[dict]:
    # 종합강의시간표에서 강의 목록 조회 XML 파싱
    schkey = fetch_schkey()

    url = "https://h5.sch.ac.kr/web/upj/standard.xpl"
    headers = {
        "Accept": "application/xml, text/xml, */*",
        "Content-Type": "text/plain;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    body = f"""<?xml version="1.0" encoding="UTF-8"?>
<Root xmlns="http://www.tobesoft.com/platform/dataset">
    <Parameters>
        <Parameter id="ncTrId">ULETKLS_pExecuteCommonService</Parameter>
        <Parameter id="IN_DATASET_LIST" />
        <Parameter id="OUT_DATASET_LIST">DS_LIST=DULE_TM_TBL_SEARCH.S_UleTmTblSearch_HTML(DS_SEARCH) </Parameter>
        <Parameter id="SCHKEY">{schkey}</Parameter>
    </Parameters>
    <Dataset id="DS_SEARCH">
        <ColumnInfo>
            <Column id="YY" type="STRING" size="256" />
            <Column id="SMT" type="STRING" size="256" />
            <Column id="CORS_NO" type="STRING" size="256" />
            <Column id="OPEN_SHYR" type="STRING" size="256" />
            <Column id="DAY_NM" type="STRING" size="256" />
            <Column id="START_LTTM" type="STRING" size="256" />
            <Column id="CDT" type="STRING" size="256" />
            <Column id="TM_CNT" type="STRING" size="256" />
            <Column id="EMP_NO" type="STRING" size="256" />
            <Column id="LECT_ROOM_NM" type="STRING" size="256" />
            <Column id="SBJT_KOR_NM" type="STRING" size="256" />
            <Column id="OPEN_ORGN" type="STRING" size="256" />
            <Column id="DOM_DIV" type="STRING" size="256" />
            <Column id="CORS_ST_DIV" type="STRING" size="256" />
            <Column id="OPEN_UNIV_CD" type="STRING" size="256" />
            <Column id="CORS" type="STRING" size="256" />
            <Column id="CYBER_LECT_YN" type="STRING" size="256" />
            <Column id="SBJT_TP_05" type="STRING" size="256" />
            <Column id="SBJT_TP_20" type="STRING" size="256" />
        </ColumnInfo>
        <Rows>
            <Row type="insert">
                <Col id="YY">{year}</Col>
                <Col id="SMT">{smt}</Col>
                <Col id="DOM_DIV">1</Col>
            </Row>
        </Rows>
    </Dataset>
</Root>"""

    response = requests.post(url, data=body, headers=headers, timeout=30)
    response.raise_for_status()

    return _parse_course_xml(response.text)


def _parse_course_xml(xml_str: str) -> list[dict]:
    # XML 응답을 파싱하여 강의 dict 리스트로 변환
    ns = {"root": "http://www.tobesoft.com/platform/dataset"}
    root = ET.fromstring(xml_str)

    rows = []
    for row in root.findall("root:Dataset[@id='DS_LIST']/root:Rows/root:Row", ns):
        cols = {col.get("id"): col.text for col in row.findall("root:Col", ns)}
        if not cols:
            continue

        cors_st_div_nm = cols.get("CORS_ST_DIV_NM", "")
        if cors_st_div_nm == "교직":
            continue

        # 교수명 아예 없거나 미지정강사인 경우 제외
        professor = (cols.get("EMP_NM") or "").strip()
        if not professor or professor == "미지정강사":
            continue

        type_map = {"전공필수": "major_req", "전공선택": "major_elec", "전공": "major_undiv", "교양": "general"}
        course_type = type_map.get(cors_st_div_nm, "general")

        rows.append({
            "year": int(cols.get("YY") or 0),
            "smt": cols.get("SMT") or "",
            "code": cols.get("CORS_NO") or "",
            "sbjt_id": cols.get("SBJT_ID") or "",
            "cls_no": cols.get("CLS_NO") or "",
            "name": cols.get("SBJT_KOR_NM") or "",
            "professor": cols.get("EMP_NM") or "",
            "professor_id": cols.get("EMP_NO") or "",
            "room": cols.get("LECT_ROOM_NM") or "",
            "department": cols.get("OPEN_ORGN_NM") or "",
            "open_org": cols.get("OPEN_ORGN") or "",
            "open_shyr": cols.get("OPEN_SHYR") or "0",
            "course_type": course_type,
            "credits": float(cols.get("CDT") or 3),
            "meeting_raw": cols.get("DAY_TM_NM") or "",
        })

    return rows


def parse_meeting_string(raw: str) -> list[tuple[int, int, int]]:
    # 요일/시간 문자열 파싱
    # '화3,4' 또는 '화7A-8A/금2B-3B' 형식
    # return: (요일(0-6), 시작교시, 종료교시) 튜플 리스트
    day_map = {"월": 0, "화": 1, "수": 2, "목": 3, "금": 4, "토": 5, "일": 6}
    meetings = []

    if not raw:
        return meetings

    for block in raw.split('/'):
        block = block.strip()
        if not block or len(block) < 2:
            continue

        day_name = block[0]
        if day_name not in day_map:
            continue

        day = day_map[day_name]
        period_str = block[1:]

        # A/B 제거: "7A-8A" -> "7-8", "3,4" -> "3,4"
        # A/B 아마 오전 오후 구분인 듯? 근데 어짜피 교시 숫자만 뽑으면 되니까 제거
        period_clean = re.sub(r'[A-Z]', '', period_str)

        try:
            if '-' in period_clean:
                start, end = map(int, period_clean.split('-'))
                meetings.append((day, start, end))
            elif ',' in period_clean:
                periods = list(map(int, period_clean.split(',')))
                if periods:
                    start = min(periods)
                    end = max(periods)
                    meetings.append((day, start, end))
            else:
                period = int(period_clean)
                meetings.append((day, period, period))
        except (ValueError, IndexError):
            continue

    return meetings


def sync_courses(year: int, smt: str) -> dict:
    # 강의 데이터 동기화 - 종합강의시간표 -> DB
    rows = fetch_courses(year, smt)

    created_count = 0
    updated_count = 0
    deleted_count = 0

    with transaction.atomic():
        existing_codes = set(
            Course.objects
            .filter(year=year, smt=smt)
            .values_list("code", flat=True)
        )
        fetched_codes = {row["code"] for row in rows}

        for row in rows:
            course, is_created = Course.objects.update_or_create(
                year=year,
                smt=smt,
                code=row["code"],
                defaults={
                    "sbjt_id": row["sbjt_id"],
                    "cls_no": row["cls_no"],
                    "name": row["name"],
                    "professor": row["professor"],
                    "professor_id": row["professor_id"],
                    "room": row["room"],
                    "department": row["department"],
                    "open_org": row["open_org"],
                    "open_shyr": row["open_shyr"],
                    "course_type": row["course_type"],
                    "credits": row["credits"],
                    "meeting_raw": row["meeting_raw"],
                }
            )

            if is_created:
                created_count += 1
            else:
                updated_count += 1

            # CourseMeeting 동기화
            meetings = parse_meeting_string(row["meeting_raw"])
            course.meetings.all().delete()
            for day, start, end in meetings:
                CourseMeeting.objects.create(
                    course=course,
                    day=day,
                    start_period=start,
                    end_period=end,
                )

        # 폐강/삭제된 강의 처리
        deleted_courses = Course.objects.filter(
            year=year,
            smt=smt,
            code__in=existing_codes - fetched_codes
        )
        deleted_count, _ = deleted_courses.delete()

    return {
        "created": created_count,
        "updated": updated_count,
        "deleted": deleted_count,
    }
