# Generated by Django 4.2.2 on 2023-07-27 03:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('waiting_list', '0004_alter_waitinglist_slug'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='waitinglist',
            options={'verbose_name': 'waiting list', 'verbose_name_plural': 'waiting lists'},
        ),
    ]
