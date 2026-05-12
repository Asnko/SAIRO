from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='credits',
            field=models.DecimalField(decimal_places=1, default=3, max_digits=3, verbose_name='학점'),
        ),
    ]
