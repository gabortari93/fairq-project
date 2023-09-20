# Generated by Django 4.2.2 on 2023-07-17 13:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('auth_token', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='authtoken',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='authtoken',
            name='used_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Used date'),
        ),
    ]
