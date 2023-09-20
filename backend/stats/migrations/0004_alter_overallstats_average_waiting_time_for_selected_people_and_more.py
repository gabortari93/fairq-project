# Generated by Django 4.2.2 on 2023-07-25 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0003_overallstats_rename_stats_waitingliststats'),
    ]

    operations = [
        migrations.AlterField(
            model_name='overallstats',
            name='average_waiting_time_for_selected_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='Average Waiting Time for Selected People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='date',
            field=models.DateField(auto_now_add=True, verbose_name='Date'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='dropped_out_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='Dropped Out People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='estimated_time_for_new_applicants',
            field=models.IntegerField(blank=True, null=True, verbose_name='Estimated Time for New Applicants'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='new_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='New People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='new_withdrawn_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='New Withdrawn People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='selected_people',
            field=models.IntegerField(blank=True, null=True, verbose_name='Selected People'),
        ),
        migrations.AlterField(
            model_name='overallstats',
            name='total_people',
            field=models.IntegerField(verbose_name='Total People'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='dropped_out_people',
            field=models.IntegerField(null=True, verbose_name='Dropped Out People'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='new_people',
            field=models.IntegerField(null=True, verbose_name='New People'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='selected_people',
            field=models.IntegerField(null=True, verbose_name='Selected People'),
        ),
        migrations.AlterField(
            model_name='waitingliststats',
            name='withdrawn_people',
            field=models.IntegerField(null=True, verbose_name='Withdrawn People'),
        ),
    ]
