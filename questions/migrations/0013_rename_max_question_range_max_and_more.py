# Generated by Django 5.0.6 on 2024-07-25 20:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0012_question_composed_forecasts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='max',
            new_name='range_max',
        ),
        migrations.RenameField(
            model_name='question',
            old_name='min',
            new_name='range_min',
        ),
    ]