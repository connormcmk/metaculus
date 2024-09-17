# Generated by Django 5.0.6 on 2024-07-05 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("scoring", "0003_alter_medalexclusionrecord_project"),
    ]

    operations = [
        migrations.AddField(
            model_name="leaderboardentry",
            name="rank",
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name="leaderboardentry",
            name="medal",
            field=models.CharField(
                choices=[("gold", "Gold"), ("silver", "Silver"), ("bronze", "Bronze")],
                max_length=200,
                null=True,
            ),
        ),
    ]