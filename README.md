# Doc-Keep

Welcome to Doc-Keep, a department-scoped document management system.

## Data Model

### Users

Users are the people who interact with the system.

| Field        | Description                                                      |
| :----------- | :--------------------------------------------------------------- |
| `id`         | Unique identifier                                                |
| `email`      | Login credential                                                 |
| `name`       | Display name                                                     |
| `role`       | One of: `viewer`, `editor`, `author`, `admin`                    |
| `department` | The department they belong to (e.g., "Engineering", "Marketing") |

### Projects

Projects are containers for documents. They're scoped to departments.

| Field         | Description                                                                        |
| :------------ | :--------------------------------------------------------------------------------- |
| `id`          | Unique identifier                                                                  |
| `name`        | Project name                                                                       |
| `description` | What the project is about                                                          |
| `ownerId`     | The user who created the project                                                   |
| `department`  | The department this project belongs to (can be null for cross-department projects) |

### Documents

Documents are the core content of the application.

| Field            | Description                                 |
| :--------------- | :------------------------------------------ |
| `id`             | Unique identifier                           |
| `title`          | Document title                              |
| `content`        | The actual document content                 |
| `status`         | One of: `draft`, `published`, `archived`    |
| `isLocked`       | Whether the document is locked from editing |
| `projectId`      | The project this document belongs to        |
| `creatorId`      | The user who created the document           |
| `lastEditedById` | The user who last modified the document     |

---

## Permission Matrix

### Projects

| Role       | View | Create | Edit | Delete |
| :--------- | :--: | :----: | :--: | :----: |
| **Viewer** |  ✅  |   ❌   |  ❌  |   ❌   |
| **Editor** |  ✅  |   ❌   |  ❌  |   ❌   |
| **Author** |  ✅  |   ❌   |  ❌  |   ❌   |
| **Admin**  |  ✅  |   ✅   |  ✅  |   ✅   |

> [!IMPORTANT]
> **Department Restriction:** All roles other than **Admin** can only access projects with a department that matches their own department, or projects with a `null` department (cross-department projects).

### Documents

| Role       | View | Create | Edit | Delete |
| :--------- | :--: | :----: | :--: | :----: |
| **Viewer** |  ✅  |   ❌   |  ❌  |   ❌   |
| **Editor** |  ✅  |   ❌   |  ✅  |   ❌   |
| **Author** |  ✅  |   ✅   |  ✅  |   ❌   |
| **Admin**  |  ✅  |   ✅   |  ✅  |   ✅   |
