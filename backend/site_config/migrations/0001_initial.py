# Generated by Django 4.2.2 on 2023-07-25 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SiteConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('catch_emails', models.BooleanField(default=False, verbose_name='Catch all emails and send to a common address instead.')),
            ],
            options={
                'verbose_name': 'Site Configuration',
            },
        ),
    ]
