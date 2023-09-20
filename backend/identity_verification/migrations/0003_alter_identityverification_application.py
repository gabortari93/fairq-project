# Generated by Django 4.2.2 on 2023-07-13 15:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0001_initial'),
        ('identity_verification', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='identityverification',
            name='application',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='verifications', to='application.application', verbose_name='Application'),
        ),
    ]
