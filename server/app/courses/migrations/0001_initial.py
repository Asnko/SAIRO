import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.PositiveIntegerField(verbose_name='학년도')),
                ('smt', models.CharField(max_length=4, verbose_name='학기코드')),
                ('code', models.CharField(max_length=20, verbose_name='강의코드(CORS_NO)')),
                ('sbjt_id', models.CharField(max_length=20, verbose_name='과목ID')),
                ('cls_no', models.CharField(max_length=10, verbose_name='분반')),
                ('name', models.CharField(max_length=100, verbose_name='강의명')),
                ('professor', models.CharField(max_length=50, verbose_name='교수명')),
                ('professor_id', models.CharField(max_length=20, verbose_name='교수번호(EMP_NO)')),
                ('room', models.CharField(max_length=50, verbose_name='강의실')),
                ('department', models.CharField(max_length=100, verbose_name='개설학과')),
                ('open_org', models.CharField(max_length=20, verbose_name='개설부서코드')),
                ('open_shyr', models.CharField(max_length=10, verbose_name='개설학년')),
                ('course_type', models.CharField(choices=[('major_req', '전공필수'), ('major_elec', '전공선택'), ('general', '교양')], max_length=20, verbose_name='이수구분')),
                ('credits', models.PositiveSmallIntegerField(default=3, verbose_name='학점')),
                ('meeting_raw', models.CharField(blank=True, max_length=100, verbose_name='요일시간(원본)')),
                ('tone', models.CharField(choices=[('blue', 'Blue'), ('sky', 'Sky'), ('purple', 'Purple'), ('gold', 'Gold')], default='blue', max_length=10, verbose_name='색상')),
            ],
            options={
                'verbose_name': '강의',
                'verbose_name_plural': '강의 목록',
                'ordering': ['year', 'smt', 'name'],
                'unique_together': {('year', 'smt', 'code')},
            },
        ),
        migrations.CreateModel(
            name='CourseMeeting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.PositiveSmallIntegerField(choices=[(0, '월'), (1, '화'), (2, '수'), (3, '목'), (4, '금'), (5, '토'), (6, '일')], verbose_name='요일')),
                ('start_period', models.PositiveSmallIntegerField(verbose_name='시작교시')),
                ('end_period', models.PositiveSmallIntegerField(verbose_name='종료교시')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meetings', to='courses.course')),
            ],
            options={
                'verbose_name': '강의 수업시간',
                'verbose_name_plural': '강의 수업시간 목록',
                'ordering': ['day', 'start_period'],
                'unique_together': {('course', 'day', 'start_period')},
            },
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enrolled_at', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='courses.course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '수강신청',
                'verbose_name_plural': '수강신청 목록',
                'unique_together': {('user', 'course')},
            },
        ),
    ]
