from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_alter_course_credits'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='meeting_raw',
            field=models.CharField(blank=True, default='', max_length=100, verbose_name='요일시간(원본)'),
        ),
    ]
