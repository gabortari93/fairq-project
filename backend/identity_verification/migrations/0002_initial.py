# Generated by Django 4.2.2 on 2023-07-13 14:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('identity_verification', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='identityverification',
            name='verified_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_verification', to='user.organisationuser', verbose_name='Verified by'),
        ),
    ]
