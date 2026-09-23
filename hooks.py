# Sec-Notes build hooks.
#
# Articles live under docs/topics/ in one of two shapes:
#   topics/<topic-slug>/<article-slug>/index.md                (flat)
#   topics/<topic-slug>/<collection-slug>/<article-slug>/index.md  (grouped,
#       e.g. a cert path like "cpts" holding several modules)
#
# The folder structure itself IS the source of truth for topic (and,
# when present, collection) — no need to repeat either in front matter.
# Each article gets its own folder so images/assets can sit right next to
# its index.md later.
#
# 1. Scans that structure + each article's real word count, and generates
#    docs/javascripts/notes-data.js with an accurate SN_NOTES array.
# 2. Auto-injects a "Published X ago · N min read" line under the H1 of
#    every article that has a `date` in its front matter.

import json
import re
from pathlib import Path

FRONT_MATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)
CODE_FENCE_RE = re.compile(r"```.*?```", re.S)

# Default tag shown for a topic when an article doesn't set one explicitly.
TOPIC_TAG_MAP = {
    "web-appsec": "WEB",
    "network-security": "NET",
    "ai-security": "AI",
    "api-sec": "API",
    "programming": "DEV",
    "htb": "HTB",
}


def _parse_front_matter(text):
    m = FRONT_MATTER_RE.match(text)
    meta = {}
    if not m:
        return meta, text
    for line in m.group(1).splitlines():
        if ":" in line and not line.strip().startswith("-"):
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta, text[m.end():]


def _word_count(body):
    # Code blocks read faster than prose; weigh them at ~40% of a normal
    # word so a snippet-heavy note doesn't get an inflated read time.
    code_words = sum(len(block.split()) for block in CODE_FENCE_RE.findall(body))
    prose = CODE_FENCE_RE.sub(" ", body)
    prose_words = len(prose.split())
    return prose_words + round(code_words * 0.4)


def _build_note(md_file, topic_slug, article_slug, collection=None):
    text = md_file.read_text(encoding="utf-8")
    meta, body = _parse_front_matter(text)
    if "date" not in meta:
        return None  # not tracked anywhere until it has a date (draft)
    words = _word_count(body)
    read_mins = max(1, round(words / 180))
    url_parts = ["topics", topic_slug]
    if collection:
        url_parts.append(collection)
    url_parts.append(article_slug)
    note = {
        "title": meta.get("title", article_slug.replace("-", " ").title()),
        "url": "/".join(url_parts) + "/",
        "topic": topic_slug,
        "tag": meta.get("tag", TOPIC_TAG_MAP.get(topic_slug, "WEB")),
        "date": meta.get("date"),
        "readMins": read_mins,
    }
    if collection:
        note["collection"] = meta.get("collection_title", collection.replace("-", " ").upper())
    return note


def on_pre_build(config, **kwargs):
    docs_dir = Path(config["docs_dir"])
    topics_dir = docs_dir / "topics"
    notes = []
    seen = set()

    # Flat shape: topics/<topic>/<article>/index.md — exactly two levels
    # under topics/, so a topic's own landing page (topics/web-appsec.md)
    # is never picked up here.
    for md_file in sorted(topics_dir.glob("*/*/index.md")):
        topic_slug = md_file.parent.parent.name
        article_slug = md_file.parent.name
        note = _build_note(md_file, topic_slug, article_slug)
        if note:
            notes.append(note)
            seen.add(md_file)

    # Grouped shape: topics/<topic>/<collection>/<article>/index.md —
    # three levels under topics/ (e.g. topics/htb/cpts/intro-to-cpts/index.md).
    for md_file in sorted(topics_dir.glob("*/*/*/index.md")):
        if md_file in seen:
            continue
        topic_slug = md_file.parent.parent.parent.name
        collection_slug = md_file.parent.parent.name
        article_slug = md_file.parent.name
        note = _build_note(md_file, topic_slug, article_slug, collection=collection_slug)
        if note:
            notes.append(note)

    js = (
        "// AUTO-GENERATED at build time by hooks.py — do not edit by hand.\n"
        "// To change a note's title/tag/date, edit that article's front matter.\n"
        "// Topic (+ collection, if any) and URL are derived from its folder path\n"
        "// under docs/topics/.\n"
        "var SN_NOTES = " + json.dumps(notes, ensure_ascii=False, indent=2) + ";\n"
    )
    out_dir = docs_dir / "javascripts"
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "notes-data.js").write_text(js, encoding="utf-8")


def on_page_markdown(markdown, page, config, files, **kwargs):
    meta = page.meta
    # Gate purely on having a `date` — that's true for every real article
    # and false for topic landing pages / aggregator index pages, so it
    # works regardless of how deep the file sits or what it's named.
    if not meta.get("date"):
        return markdown
    badge = (
        f'<p><span class="sn-pub-date" data-date="{meta["date"]}"></span>'
        f' · <span class="sn-read-badge"></span></p>\n'
    )
    lines = markdown.split("\n", 1)
    heading_re = re.compile(r"^#\s+.+$")
    if lines and heading_re.match(lines[0]):
        rest = lines[1] if len(lines) > 1 else ""
        return lines[0] + "\n\n" + badge + "\n" + rest
    return badge + "\n" + markdown
