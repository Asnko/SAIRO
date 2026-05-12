from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from ...services import sync_courses


class Command(BaseCommand):
    help = "학사정보시스템에서 강의 데이터 동기화"

    def add_arguments(self, parser):
        parser.add_argument(
            "--year",
            type=int,
            default=timezone.now().year,
            help="학년도 (기본값: 현재 연도)",
        )
        parser.add_argument(
            "--smt",
            type=str,
            default="11",
            help="학기코드 (기본값: 11 = 1학기)",
        )

    def handle(self, *args, **options):
        year = options["year"]
        smt = options["smt"]

        try:
            self.stdout.write(f"동기화 시작: {year}년도 {smt}학기")
            result = sync_courses(year, smt)

            self.stdout.write(
                self.style.SUCCESS(
                    f"✓ 동기화 완료\n"
                    f"  - 신규: {result['created']}\n"
                    f"  - 갱신: {result['updated']}\n"
                    f"  - 삭제: {result['deleted']}"
                )
            )
        except Exception as e:
            raise CommandError(f"동기화 실패: {str(e)}")

