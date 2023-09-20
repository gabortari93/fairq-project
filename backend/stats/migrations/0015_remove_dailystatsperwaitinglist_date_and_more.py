# Generated by Django 4.2.2 on 2023-07-28 08:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0014_alter_dailystatsperwaitinglist_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dailystatsperwaitinglist',
            name='date',
        ),
        migrations.AddField(
            model_name='dailystatsperwaitinglist',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Date created'),
            preserve_default=False,
        ),
    ]