# Generated by Django 4.2.2 on 2023-07-18 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reconfirmation', '0003_alter_reconfirmation_first_reminder_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reconfirmation',
            name='deadline',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Reconfirmation deadline'),
        ),
    ]
