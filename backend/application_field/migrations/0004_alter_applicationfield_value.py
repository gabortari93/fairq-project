# Generated by Django 4.2.2 on 2023-07-24 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application_field', '0003_alter_applicationfield_value'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationfield',
            name='value',
            field=models.TextField(blank=True, null=True, verbose_name='Application field value'),
        ),
    ]
