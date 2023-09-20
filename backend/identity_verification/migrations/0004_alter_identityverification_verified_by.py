# Generated by Django 4.2.2 on 2023-07-13 15:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organisation_user', '0001_initial'),
        ('identity_verification', '0003_alter_identityverification_application'),
    ]

    operations = [
        migrations.AlterField(
            model_name='identityverification',
            name='verified_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_verification', to='organisation_user.organisationuser', verbose_name='Verified by'),
        ),
    ]
