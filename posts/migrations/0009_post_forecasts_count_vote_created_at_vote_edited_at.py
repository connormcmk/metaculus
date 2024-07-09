# Generated by Django 5.0.6 on 2024-07-09 18:06

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0008_alter_post_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="forecasts_count",
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
        ),
        migrations.AddField(
            model_name="vote",
            name="created_at",
            field=models.DateTimeField(
                default=django.utils.timezone.now, editable=False
            ),
        ),
        migrations.AddField(
            model_name="vote",
            name="edited_at",
            field=models.DateTimeField(
                default=django.utils.timezone.now, editable=False, null=True
            ),
        ),
    ]