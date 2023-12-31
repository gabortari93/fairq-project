# Generated by Django 4.2.2 on 2023-07-13 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.IntegerField(choices=[(1, 'Invited'), (2, 'Joined'), (3, 'Removed')], default=1, verbose_name='Status')),
                ('role', models.IntegerField(choices=[(1, 'Viewer'), (2, 'Administrator')], default=1, verbose_name='Role')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
