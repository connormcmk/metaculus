#! /bin/bash

cd /app/
source venv/bin/activate

python3 manage.py rundramatiq --processes 4 --threads 8