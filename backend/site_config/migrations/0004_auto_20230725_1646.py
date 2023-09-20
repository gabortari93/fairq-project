from django.db import migrations

def create_siteconfiguration(apps, schema_editor):
    SiteConfiguration = apps.get_model('site_config', 'SiteConfiguration')
    if not SiteConfiguration.objects.exists():
        SiteConfiguration.objects.create()

class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0003_alter_siteconfiguration_catch_all_email_address_and_more'),
    ]

    operations = [
        migrations.RunPython(create_siteconfiguration),
    ]
