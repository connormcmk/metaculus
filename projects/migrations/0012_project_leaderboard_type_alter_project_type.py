# Generated by Django 5.0.6 on 2024-06-26 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0011_alter_project_default_permission_alter_project_emoji_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='leaderboard_type',
            field=models.CharField(choices=[('relative_legacy', 'Relative Legacy'), ('peer', 'Peer'), ('baseline', 'Baseline'), ('spot_peer', 'Spot Peer'), ('spot_baseline', 'Spot Baseline'), ('comment_insight', 'Comment Insight'), ('question_writing', 'Question Writing')], max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='type',
            field=models.CharField(choices=[('site_main', 'Site Main'), ('tournament', 'Tournament'), ('global_leaderboard', 'Global Leaderboard'), ('question_series', 'Question Series'), ('personal_project', 'Personal Project'), ('category', 'Category'), ('tag', 'Tag'), ('topic', 'Topic')], db_index=True, max_length=32),
        ),
    ]