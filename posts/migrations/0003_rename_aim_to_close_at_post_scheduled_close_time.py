# Generated by Django 5.0.6 on 2024-07-03 17:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0002_alter_notebook_image_url_alter_notebook_news_type"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post",
            old_name="aim_to_close_at",
            new_name="scheduled_close_time",
        ),
        migrations.RenameField(
            model_name="post",
            old_name="aim_to_resolve_at",
            new_name="scheduled_resolve_time",
        ),
    ]