import sqlite3

DB_PATH = 'data_management/inklings.db'

# Create the DB in the current folder
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# def get_entries_with_field_names(table_name):
#     raw_entries = cur.execute(f'SELECT * FROM {table_name}')
#     headers = [col[0] for col in cur.description]
#     return [dict(zip(headers, entry)) for entry in raw_entries]

# items = get_entries_with_field_names('items')

# for item in items:
#     if '/' in item['start_edtf']:
#         parts = item['start_edtf'].split('/')
#         start = parts[0]
#         end = parts[1]

#         cur.execute('UPDATE items SET end_edtf = ? WHERE id = ?', (end, item['id']))
#         cur.execute('UPDATE items SET start_edtf = ? WHERE id = ?', (start, item['id']))

conn.commit()
conn.close()
