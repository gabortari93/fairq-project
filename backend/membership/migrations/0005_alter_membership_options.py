# Generated by Django 4.2.2 on 2023-07-27 03:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('membership', '0004_alter_membership_role'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='membership',
            options={'verbose_name': 'organisation membership', 'verbose_name_plural': 'organisation memberships'},
        ),
    ]