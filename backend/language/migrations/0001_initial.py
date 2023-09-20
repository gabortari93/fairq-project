# Generated by Django 4.2.2 on 2023-07-13 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('iso_code', models.CharField(choices=[('de', 'German'), ('en', 'English'), ('hu', 'Hungarian')], default='en', max_length=2, unique=True, verbose_name='Language ISO code')),
            ],
        ),
    ]