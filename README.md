# AK Developers Project Showcase

A modern static portfolio and project showcase for **AK DEVELOPERS**. It is designed for an Instagram bio link: visitors can search, filter, launch demos, like, favorite, share, and view project details.

## Files

- `index.html` - public showcase website
- `style.css` - responsive landing page and component styling
- `script.js` - project data, filters, search, modal, counters, theme, visitor actions
- `admin.html` - hidden admin panel at `/admin.html`
- `admin.css` - admin interface styling
- `admin.js` - local-storage project CRUD
- `assets/images/` - project thumbnails
- `assets/icons/` - favicon and icons

## Admin

Open `admin.html` and use this default password:

```text
akdevelopers
```

Projects are saved in browser Local Storage under:

```text
akDevelopersProjects
```

The admin panel supports adding, editing, deleting, thumbnail upload, demo URL, GitHub URL, category, tags, version, status, date, difficulty, development time, and featured toggle.

## Notes

This project uses only HTML, CSS, and vanilla JavaScript. No frameworks or build step are required. Open `index.html` directly in a browser or host the folder on any static hosting platform.
