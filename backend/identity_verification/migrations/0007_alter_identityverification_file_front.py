# Generated by Django 4.2.2 on 2023-07-20 18:23

from django.db import migrations, models
import identity_verification.models


class Migration(migrations.Migration):

    dependencies = [
        ('identity_verification', '0006_remove_identityverification_verified_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='identityverification',
            name='file_front',
            field=models.ImageField(blank=True, max_length=254, null=True, upload_to=identity_verification.models.file_path, verbose_name='Front side'),
        ),
    ]
