# Generated by Django 4.2.2 on 2023-07-27 03:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reconfirmation', '0006_reconfirmation_first_reminder_sent_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='reconfirmation',
            options={'verbose_name': 'interest reconfirmation', 'verbose_name_plural': 'interest reconfirmations'},
        ),
    ]