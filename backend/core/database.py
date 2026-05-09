import sqlite3
import os
from datetime import datetime

DB_PATH = "data/daraklab.db"

class DBManager:
    def __init__(self):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.create_tables()

    def create_tables(self):
        cursor = self.conn.cursor()
        
        # Experiments table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            objective TEXT,
            config TEXT,
            hardware TEXT,
            result TEXT,
            blockers TEXT,
            conclusions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Notes/Standups table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        self.conn.commit()

    def add_experiment(self, data: dict):
        cursor = self.conn.cursor()
        cursor.execute('''
        INSERT INTO experiments (title, objective, config, hardware, result, blockers, conclusions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data.get('title'), data.get('objective'), data.get('config'), 
              data.get('hardware'), data.get('result'), data.get('blockers'), data.get('conclusions')))
        self.conn.commit()
        return cursor.lastrowid

    def get_experiments(self):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM experiments ORDER BY created_at DESC')
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

db_manager = DBManager()
