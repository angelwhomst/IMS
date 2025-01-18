<<<<<<< HEAD
# import aioodbc

# # database config
# server = 'LAPTOP-SSFC864F'
# database = 'IMS'
# username = 'IMS_user'
# password = 'IMS_password'
# driver = 'ODBC Driver 17 for SQL Server'

# # async function to get db connection
# async def get_db_connection():
#     dsn = (
#         f"DRIVER={{{driver}}};"
#         f"SERVER={server};"
#         f"DATABASE={database};"
#         f"UID={username};"
#         f"PWD={password};"
#     )
#     conn = await aioodbc.connect(dsn=dsn, autocommit=True)
#     async def dict_row_factory(cursor, row):
#         return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}
    
#     conn.row_factory = dict_row_factory
#     return conn

import aioodbc

# database config
server = 'LAPTOP-SSFC864F'
database = 'IMS'
=======
import aioodbc

# database config
server = 'LAPTOP-8KPHOHE5\\SQLEXPRESS'
database = 'IMS'
username = 'Heart'
password = 'Heart123'
>>>>>>> IMS-DASH/master
driver = 'ODBC Driver 17 for SQL Server'

# async function to get db connection
async def get_db_connection():
    dsn = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
<<<<<<< HEAD
        "Trusted_Connection=yes;"
    )
    conn = await aioodbc.connect(dsn=dsn, autocommit=True)

    async def dict_row_factory(cursor, row):
        return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

    conn.row_factory = dict_row_factory
    return conn
=======
        f"UID={username};"
        f"PWD={password};"
    )
    conn = await aioodbc.connect(dsn=dsn, autocommit=True)
    async def dict_row_factory(cursor, row):
        return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}
    
    conn.row_factory = dict_row_factory
    return conn
>>>>>>> IMS-DASH/master
