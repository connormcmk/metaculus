# Generated by Django 5.0.6 on 2024-07-03 23:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='leaderboard_type',
        ),
    ]
