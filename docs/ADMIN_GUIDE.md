# Admin Guide

## Dashboard

Shows content counts, page count, new messages and recent contact submissions.

## Content

Use one editor for research, projects, publications, experience, events, achievements, skills, education, blogs and future timeline entries.

Important fields:

- `Slug`: lowercase letters, numbers and hyphens only
- `Summary`: card and page preview copy
- `Full content`: Markdown supported
- `Visible`: controls public visibility
- `Featured`: highlights a record on the home page
- `Order`: lower numbers appear first
- `Metrics JSON`: example `[{"label":"CGPA","value":"3.99/4.00"}]`
- `Links JSON`: example `[{"label":"GitHub","url":"https://github.com/..."}]`
- `Metadata JSON`: flexible research or project-specific information

## Pages

Edit the main title, eyebrow, subtitle, introduction, order, visibility and SEO details for every public page. New custom page metadata can also be stored.

## Site settings

Controls:

- Portfolio/system name
- Hero identity and description
- Email, location and availability
- Profile and resume URLs
- Accent colors
- Terminal greeting
- Home-page statistics
- Social links
- Footer and SEO defaults

## Media

Upload JPEG, PNG, WebP, GIF or PDF files up to 6 MB. Copy the returned `/uploads/...` URL into a content record or site setting.

Local media storage is suitable for a single server. Use S3, Cloudinary or another object-storage provider before scaling to multiple server instances.

## Messages

Read contact submissions, mark them as read, archive them or delete them.
