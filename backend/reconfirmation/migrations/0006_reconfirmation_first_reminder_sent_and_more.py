# Generated by Django 4.2.2 on 2023-07-19 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reconfirmation', '0005_alter_reconfirmation_deadline_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reconfirmation',
            name='first_reminder_sent',
            field=models.DateTimeField(blank=True, null=True, verbose_name='First reminder sent'),
        ),
        migrations.AddField(
            model_name='reconfirmation',
            name='removed_sent',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Removed email sent'),
        ),
        migrations.AddField(
            model_name='reconfirmation',
            name='second_reminder_sent',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Second reminder sent'),
        ),
    ]