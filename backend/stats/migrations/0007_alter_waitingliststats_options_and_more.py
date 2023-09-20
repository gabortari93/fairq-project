# Generated by Django 4.2.2 on 2023-07-26 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0006_overallstats_age_0_18_overallstats_age_19_25_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='waitingliststats',
            options={},
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='average_waiting_time_for_selected_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='Average Waiting Time for Selected People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='estimated_time_for_new_applicants',
            field=models.IntegerField(blank=True, null=True, verbose_name='Estimated Time for New Applicants'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='average_waiting_time_for_selected_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='Average Waiting Time for Selected People'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='estimated_time_for_new_applicants',
            field=models.IntegerField(blank=True, null=True, verbose_name='Estimated Time for New Applicants'),
        ),
    ]
