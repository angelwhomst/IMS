import aioodbc

# database config
server = 'LAPTOP-SSFC864F'
database = 'IMS'
driver = 'ODBC Driver 17 for SQL Server'

# async function to get db connection
async def get_db_connection():
    dsn = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        "Trusted_Connection=yes;"
    )
    conn = await aioodbc.connect(dsn=dsn, autocommit=True)

    async def dict_row_factory(cursor, row):
        return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

    conn.row_factory = dict_row_factory
    return conn


# import os
# import aioodbc

# server = os.getenv("ims-vms.database.windows.net")
# database = os.getenv("IMS")
# username = os.getenv("ims_vms_admin")
# password = os.getenv("Olivarez12345")

# async def get_db_connection():
#     dsn = (
#         f"DRIVER={{ODBC Driver 17 for SQL Server}};"
#         f"SERVER={server};"
#         f"DATABASE={database};"
#         f"UID={username};"
#         f"PWD={password};"
#         "Encrypt=yes;TrustServerCertificate=no;"
#     )
#     conn = await aioodbc.connect(dsn=dsn, autocommit=True)
#     return conn


'''
Server=tcp:ims-vms.database.windows.net,1433;Initial Catalog=IMS;Persist Security Info=False;User ID=ims_vms_admin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
'''