---
title: "HTML Injection — ALL THINGS"
tag: WEB
labels: HTMLI, PHISHING
date: "2026-09-22"
tags:
  - web
  - html-injection
  - phishing
---
# HTML Injection — Complete Beginner Bug Hunter Guide

> A practical guide for beginner bug hunters to understand, discover, validate, exploit safely, and report HTML Injection vulnerabilities.

---

## Table of Contents

- [HTML Injection — Complete Beginner Bug Hunter Guide](#html-injection--complete-beginner-bug-hunter-guide)
  - [Table of Contents](#table-of-contents)
- [1. What Is HTML Injection?](#1-what-is-html-injection)
- [Welcome, **Injected**](#welcome-injected)
- [2. HTML Basics You Need Before Testing](#2-html-basics-you-need-before-testing)
- [3. How HTML Injection Happens](#3-how-html-injection-happens)
- [4. HTML Injection vs XSS](#4-html-injection-vs-xss)
    - [HTML Injection](#html-injection)
    - [XSS](#xss)
    - [Important Bug Bounty Rule](#important-bug-bounty-rule)
- [5. Types of HTML Injection](#5-types-of-html-injection)
  - [5.1 Reflected HTML Injection](#51-reflected-html-injection)
  - [5.2 Stored HTML Injection](#52-stored-html-injection)
  - [5.3 DOM-Based HTML Injection](#53-dom-based-html-injection)
- [6. Understanding HTML Contexts](#6-understanding-html-contexts)
    - [HTML body](#html-body)
    - [Attribute](#attribute)
    - [Link](#link)
    - [Image](#image)
    - [JavaScript](#javascript)
    - [CSS](#css)
- [7. Where to Look for HTML Injection](#7-where-to-look-for-html-injection)
  - [Common inputs](#common-inputs)
- [8. First Detection Method](#8-first-detection-method)
- [9. Safe HTML Injection Payloads](#9-safe-html-injection-payloads)
  - [Basic text formatting](#basic-text-formatting)
  - [Element creation](#element-creation)
  - [Link creation](#link-creation)
  - [Image element](#image-element)
- [10. Testing HTML Body Context](#10-testing-html-body-context)
    - [What you should record](#what-you-should-record)
- [11. Testing Attribute Context](#11-testing-attribute-context)
- [12. Breaking Out of Quoted Attributes](#12-breaking-out-of-quoted-attributes)
- [13. Testing Links and URLs](#13-testing-links-and-urls)
- [14. Testing Form Injection](#14-testing-form-injection)
- [15. Base Tag Injection](#15-base-tag-injection)
- [16. Relative URLs and Why `<base>` Matters](#16-relative-urls-and-why-base-matters)
  - [Testing for Base Tag Injection](#testing-for-base-tag-injection)
  - [CSP Defense](#csp-defense)
- [17. DOM-Based HTML Injection](#17-dom-based-html-injection)
  - [Example](#example)
- [18. Stored HTML Injection](#18-stored-html-injection)
  - [Stored Injection Testing Method](#stored-injection-testing-method)
    - [Step 1](#step-1)
    - [Step 2](#step-2)
    - [Step 3](#step-3)
    - [Step 4](#step-4)
    - [Step 5](#step-5)
    - [Step 6](#step-6)
    - [Step 7](#step-7)
- [19. Reflected HTML Injection](#19-reflected-html-injection)
  - [Reflected Injection Checklist](#reflected-injection-checklist)
- [20. HTML Injection Through APIs](#20-html-injection-through-apis)
- [21. HTML Injection in Modern Applications](#21-html-injection-in-modern-applications)
- [22. Testing Methodology With Burp Suite](#22-testing-methodology-with-burp-suite)
  - [Step 1 — Find an Input](#step-1--find-an-input)
  - [Step 2 — Send to Repeater](#step-2--send-to-repeater)
  - [Step 3 — Change the Value](#step-3--change-the-value)
  - [Step 4 — Search the Response](#step-4--search-the-response)
  - [Step 5 — Test HTML](#step-5--test-html)
  - [Step 6 — Inspect the Rendered Result](#step-6--inspect-the-rendered-result)
- [23. Finding the Injection Context](#23-finding-the-injection-context)
- [24. Understanding Encoding](#24-understanding-encoding)
- [25. HTML Entity Encoding](#25-html-entity-encoding)
- [26. Filter and WAF Testing](#26-filter-and-waf-testing)
  - [What to Test](#what-to-test)
- [27. Common Developer Mistakes](#27-common-developer-mistakes)
  - [Mistake 1 — String concatenation](#mistake-1--string-concatenation)
  - [Mistake 2 — Trusting client-side validation](#mistake-2--trusting-client-side-validation)
  - [Mistake 3 — Blacklisting `<script>`](#mistake-3--blacklisting-script)
  - [Mistake 4 — Encoding only some characters](#mistake-4--encoding-only-some-characters)
  - [Mistake 5 — Encoding too early](#mistake-5--encoding-too-early)
- [28. Impact Assessment](#28-impact-assessment)
  - [Low-impact example](#low-impact-example)
  - [Higher-impact example](#higher-impact-example)
  - [Higher-impact example](#higher-impact-example-1)
  - [Higher-impact example](#higher-impact-example-2)
  - [Potential escalation](#potential-escalation)
- [29. When HTML Injection Becomes XSS](#29-when-html-injection-becomes-xss)
- [30. HTML Injection and CSRF](#30-html-injection-and-csrf)
- [31. HTML Injection and Password Managers](#31-html-injection-and-password-managers)
- [32. HTML Injection and Phishing](#32-html-injection-and-phishing)
- [33. How to Confirm a Real Vulnerability](#33-how-to-confirm-a-real-vulnerability)
  - [1. Input Control](#1-input-control)
  - [2. HTML Interpretation](#2-html-interpretation)
  - [3. Security Impact](#3-security-impact)
- [34. False Positives](#34-false-positives)
- [35. Bug Bounty Severity](#35-bug-bounty-severity)
- [36. Writing the Bug Report](#36-writing-the-bug-report)
- [37. Remediation](#37-remediation)
- [38. Developer-Side Secure Coding](#38-developer-side-secure-coding)
  - [Unsafe](#unsafe)
  - [Safer](#safer)
  - [Server-Side Example](#server-side-example)
- [39. HTML Sanitization](#39-html-sanitization)
- [40. Content Security Policy](#40-content-security-policy)
- [41. Testing Checklist](#41-testing-checklist)
  - [Discovery](#discovery)
  - [Reflection](#reflection)
  - [Context](#context)
  - [Encoding](#encoding)
  - [HTML](#html)
  - [Impact](#impact)
- [42. Beginner Bug Hunter Workflow](#42-beginner-bug-hunter-workflow)
- [43. Advanced Testing Ideas](#43-advanced-testing-ideas)
  - [43.1 Context transitions](#431-context-transitions)
  - [43.2 Tag termination](#432-tag-termination)
  - [43.3 Attribute injection](#433-attribute-injection)
  - [43.4 URL manipulation](#434-url-manipulation)
  - [43.5 Base URL manipulation](#435-base-url-manipulation)
  - [43.6 DOM sinks](#436-dom-sinks)
- [44. Useful Tools](#44-useful-tools)
  - [Burp Suite](#burp-suite)
  - [Browser DevTools](#browser-devtools)
  - [Browser View Source](#browser-view-source)
- [45. Final Cheat Sheet](#45-final-cheat-sheet)
  - [Definition](#definition)
  - [Main Types](#main-types)
  - [First Payload](#first-payload)
  - [Other Safe Tests](#other-safe-tests)
  - [Main Question](#main-question)
  - [Contexts](#contexts)
  - [Dangerous Sinks](#dangerous-sinks)
  - [Interesting HTML Elements](#interesting-html-elements)
  - [Base Tag](#base-tag)
  - [Encoding](#encoding-1)
  - [Detection Logic](#detection-logic)
  - [Reporting Rule](#reporting-rule)
- [46. References](#46-references)
    - [OWASP](#owasp)
    - [PortSwigger](#portswigger)
    - [CWE](#cwe)
    - [Invicti](#invicti)
    - [Qualys](#qualys)
    - [Punk Security](#punk-security)
    - [CDNetworks](#cdnetworks)
    - [Wallarm](#wallarm)
- [The Most Important Lesson](#the-most-important-lesson)

---

# 1. What Is HTML Injection?

HTML Injection happens when an application takes attacker-controlled input and places it into an HTML page **without properly encoding or sanitizing it**.

The browser then interprets the injected input as **HTML** instead of treating it as normal text.

For example, imagine a website contains:

```html
<h1>Welcome, USERNAME</h1>
```

The application expects:

```text
Welcome, Ahmed
```

But an attacker supplies:

```html
<b>Injected</b>
```

The server might generate:

```html
<h1>Welcome, <b>Injected</b></h1>
```

The browser renders:

# Welcome, **Injected**

The important point is:

> The attacker did not simply change text. They changed the structure of the HTML document.

OWASP describes HTML Injection as the ability to control an input point and inject arbitrary HTML into a vulnerable web page.

Invicti similarly describes HTML Injection as arbitrary HTML markup being inserted into legitimate application HTML.

---

# 2. HTML Basics You Need Before Testing

You do **not** need to become an HTML expert before hunting HTML Injection.

You should understand:

```html
<tag>content</tag>
```

Examples:

```html
<p>Hello</p>
<h1>Hello</h1>
<b>Hello</b>
<i>Hello</i>
<div>Hello</div>
<a href="/profile">Profile</a>
<img src="/image.png">
```

HTML elements can also contain attributes:

```html
<a href="/profile" class="button">Profile</a>
```

Here:

```text
a       = tag
href    = attribute
/profile = attribute value
```

Another example:

```html
<input type="text" value="Ahmed">
```

The value is inside an HTML attribute.

This distinction is extremely important for bug hunting.

---

# 3. How HTML Injection Happens

The basic vulnerability looks like this:

```text
Attacker Input
      |
      v
Application
      |
      v
HTML Response
      |
      v
Browser
      |
      v
Injected HTML
```

For example:

```text
GET /search?q=hello
```

Application:

```html
<h2>Search results for: hello</h2>
```

Now test:

```text
GET /search?q=<b>TEST</b>
```

If the response becomes:

```html
<h2>Search results for: <b>TEST</b></h2>
```

the application is interpreting attacker-controlled input as HTML.

If instead the response becomes:

```html
<h2>Search results for: &lt;b&gt;TEST&lt;/b&gt;</h2>
```

the application is treating it as text.

That distinction is the foundation of HTML Injection testing.

---

# 4. HTML Injection vs XSS

This is one of the most important concepts for a beginner.

HTML Injection and XSS are closely related, but they are not automatically the same finding.

### HTML Injection

The attacker can inject HTML:

```html
<b>Injected text</b>
```

but cannot execute attacker-controlled JavaScript.

### XSS

The attacker can execute JavaScript in the victim's browser.

For example, conceptually:

```html
<script>...</script>
```

or another scriptable HTML context.

OWASP and CWE treat XSS as a broader weakness involving improper neutralization of untrusted input during web-page generation. CWE-79 explicitly discusses HTML body, attributes, URLs, JavaScript, CSS, and other contexts.

Invicti notes that HTML Injection is generally more limited than XSS because pure HTML does not inherently provide the same scripting capabilities.

### Important Bug Bounty Rule

Do **not** automatically report:

```text
HTML reflected
```

as:

```text
Stored XSS
```

or:

```text
Reflected XSS
```

unless you actually demonstrate script execution or another accepted XSS condition.

---

# 5. Types of HTML Injection

There are three useful categories to understand.

## 5.1 Reflected HTML Injection

The payload comes from the request and is immediately reflected.

Example:

```text
/search?q=<b>TEST</b>
```

Response:

```html
<h1>Results for <b>TEST</b></h1>
```

The payload is not permanently stored.

Invicti describes reflected HTML Injection as malicious HTML being reflected from request input into the response.

---

## 5.2 Stored HTML Injection

The application stores attacker-controlled HTML and displays it later.

Example:

```text
Username:
<b>HACKED</b>
```

The application stores it.

Later:

```html
Welcome <b>HACKED</b>
```

Every user viewing the affected page may see the injected content.

Possible locations include:

* comments
* profiles
* usernames
* display names
* posts
* tickets
* support messages
* project names
* organization names
* document titles
* notifications
* chat messages
* custom fields

Stored injection can therefore have a much larger audience than a reflected issue.

---

## 5.3 DOM-Based HTML Injection

The server may never receive the malicious input.

Instead, JavaScript takes attacker-controlled data and writes it into the DOM unsafely.

Example:

```javascript
const value = location.hash.substring(1);

document.getElementById("output").innerHTML = value;
```

An attacker-controlled fragment can then become HTML.

OWASP specifically identifies dangerous DOM sinks such as:

```javascript
innerHTML
document.write()
```

when they process untrusted input.

---

# 6. Understanding HTML Contexts

Before creating a payload, always ask:

> **Where exactly does my input appear in the HTML response?**

This is probably the most important skill in HTML/XSS testing.

Your input could appear in:

### HTML body

```html
<div>YOUR_INPUT</div>
```

### Attribute

```html
<input value="YOUR_INPUT">
```

### Link

```html
<a href="YOUR_INPUT">
```

### Image

```html
<img src="YOUR_INPUT">
```

### JavaScript

```html
<script>
let value = "YOUR_INPUT";
</script>
```

### CSS

```html
<style>
.example {
    background: YOUR_INPUT;
}
</style>
```

Each context behaves differently.

PortSwigger emphasizes that identifying the exact injection context is a fundamental part of testing reflected and stored XSS because the context determines which payloads can work.

---

# 7. Where to Look for HTML Injection

As a beginner, start with anything that accepts user-controlled data.

## Common inputs

Look at:

```text
Search
Username
Display name
First name
Last name
Company name
Project name
Team name
Comment
Description
Bio
Address
Message
Ticket title
Ticket body
File name
Document name
Product name
Category
Tag
Notification text
```

Also inspect:

```text
Query parameters
Path parameters
POST parameters
JSON fields
Multipart fields
HTTP headers
Cookies
URL fragments
WebSocket messages
GraphQL variables
API requests
```

Do not assume that only visible form fields matter.

An API may accept:

```json
{
  "fullname": "..."
}
```

and later render that value in another part of the application.

---

# 8. First Detection Method

Start with a harmless marker.

Use something unique:

```text
HTMLTEST123
```

Submit it.

Then search for:

```text
HTMLTEST123
```

in:

* response body
* rendered page
* DOM
* page source

If reflected, determine exactly where.

Next, test whether HTML is interpreted.

A safe first payload:

```html
<b>HTMLTEST123</b>
```

If rendered bold:

```text
HTMLTEST123
```

you have evidence that HTML markup is being interpreted.

Another useful harmless test:

```html
<i>HTMLTEST123</i>
```

or:

```html
<h1>HTMLTEST123</h1>
```

The goal of the first phase is not exploitation.

The goal is:

> **Determine whether attacker-controlled input changes the HTML document structure.**

Qualys specifically notes that merely finding your string in the response is not enough; a scanner should determine whether the input actually changes the document structure or causes browser-relevant behavior.

---

# 9. Safe HTML Injection Payloads

Start simple.

## Basic text formatting

```html
<b>TEST</b>
```

```html
<i>TEST</i>
```

```html
<h1>TEST</h1>
```

```html
<u>TEST</u>
```

```html
<mark>TEST</mark>
```

## Element creation

```html
<div>TEST</div>
```

```html
<p>TEST</p>
```

```html
<span>TEST</span>
```

## Link creation

```html
<a href="/test">TEST</a>
```

## Image element

```html
<img src="/test.png">
```

These payloads are useful because they help determine what the application permits without immediately moving into JavaScript execution.

Qualys points out that even successfully creating an otherwise meaningless HTML element can demonstrate that input is not being handled securely.

---

# 10. Testing HTML Body Context

Suppose you find:

```html
<div>
    SEARCH_VALUE
</div>
```

Your input:

```text
HTMLTEST
```

becomes:

```html
<div>
    HTMLTEST
</div>
```

Now try:

```html
<b>HTMLTEST</b>
```

If the browser displays:

**HTMLTEST**

you have confirmed HTML interpretation.

Try:

```html
<h1>HTMLTEST</h1>
```

If the page layout changes because an `<h1>` element was created, that is stronger evidence.

### What you should record

Document:

```text
Input:
<b>HTMLTEST</b>

Expected:
<b>HTMLTEST</b> displayed literally.

Actual:
The browser rendered HTMLTEST as bold text.
```

---

# 11. Testing Attribute Context

Now imagine:

```html
<input value="YOUR_INPUT">
```

Your input is inside an attribute.

If you submit:

```text
HTMLTEST
```

the browser sees:

```html
<input value="HTMLTEST">
```

Try determining whether quotation marks are correctly handled.

For example:

```text
TEST"TEST
```

Look at the resulting HTML.

Secure output might be:

```html
<input value="TEST&quot;TEST">
```

Potentially unsafe output could resemble:

```html
<input value="TEST"TEST">
```

The second case suggests that the attacker may be able to alter the HTML structure.

PortSwigger describes this exact concept: when input lands inside an attribute value, the tester needs to understand whether the value can be terminated and whether additional markup/attributes can then be introduced.

---

# 12. Breaking Out of Quoted Attributes

Suppose the application generates:

```html
<input type="text" value="USER_INPUT">
```

The intended structure is:

```text
value="USER_INPUT"
```

The important characters are:

```text
"
```

because the quote terminates the attribute.

A controlled test could be:

```text
TEST"TEST
```

Then inspect:

```html
<input type="text" value="TEST"TEST">
```

If the quote is not encoded, the application may be allowing structural HTML manipulation.

This does **not automatically mean XSS**.

You have established an attribute injection condition.

The next step is to determine what impact that context allows.

---

# 13. Testing Links and URLs

A common context is:

```html
<a href="USER_INPUT">Click</a>
```

or:

```html
<link href="USER_INPUT">
```

or:

```html
<img src="USER_INPUT">
```

Test with harmless URLs first.

Example:

```text
https://example.com/
```

Then compare:

```text
javascript:
```

and other schemes only on authorized targets and where the testing program permits such testing.

The important concept is that URL-valued attributes are not equivalent to normal text attributes.

PortSwigger notes that URL attributes can themselves create scriptable contexts and therefore require context-specific handling.

---

# 14. Testing Form Injection

Forms deserve special attention.

Suppose a page contains:

```html
<form action="/login" method="POST">
    <input name="username">
    <input name="password">
</form>
```

If an attacker can inject HTML before or around the form, the resulting document structure may behave differently.

A particularly important concept is:

```html
<form>
```

elements.

HTML parsing rules do not allow forms to behave like ordinary nested containers.

Therefore, malformed or injected form markup can sometimes change which controls belong to which form.

This is why an HTML Injection finding involving forms can have greater impact than simple visual modification.

However:

> Do not submit real credentials during testing.

Use dummy accounts and dummy data.

---

# 15. Base Tag Injection

One of the most interesting HTML Injection variants is:

```html
<base>
```

The `<base>` element establishes the base URL used to resolve relative URLs in a document.

For example:

```html
<base href="https://example.com/">
```

Consider:

```html
<script src="/static/app.js"></script>
```

With the appropriate base URL, relative references are resolved against that base.

Punk Security describes Base Tag Injection as a lesser-known HTML Injection technique where an attacker-controlled `<base>` element changes how relative URLs in the document are resolved.

---

# 16. Relative URLs and Why `<base>` Matters

Suppose a page contains:

```html
<img src="/images/logo.png">
```

and:

```html
<script src="/static/app.js"></script>
```

and:

```html
<a href="/account">Account</a>
```

Relative references depend on a base URL.

If an attacker can introduce:

```html
<base href="https://controlled.example/">
```

then subsequent relative references may resolve against that origin.

Conceptually:

```text
/static/app.js
```

could resolve as:

```text
https://controlled.example/static/app.js
```

depending on the document and URL structure.

This is why Base Tag Injection can be much more interesting than simply injecting:

```html
<b>TEST</b>
```

Punk Security documents possible effects on scripts, stylesheets, links, and images.

---

## Testing for Base Tag Injection

First determine whether:

```html
<base>
```

is accepted.

Use a harmless base pointing to infrastructure you control or a test domain authorized by the program.

Example:

```html
<base href="https://controlled.example/">
```

Then inspect the DOM and browser network requests.

You are looking for:

```text
Relative URL
      ↓
Unexpected base
      ↓
Unexpected destination
```

Do not use this technique to collect real credentials, authentication tokens, or other users' information.

---

## CSP Defense

A useful defense is:

```http
Content-Security-Policy: base-uri 'self'
```

or, depending on the application's architecture:

```http
Content-Security-Policy: base-uri 'none'
```

Punk Security specifically highlights the CSP `base-uri` directive as a defense against Base Tag Injection.

Invicti also notes that CSP can mitigate some Base Tag Injection scenarios but should not be treated as a complete defense against HTML Injection.

---

# 17. DOM-Based HTML Injection

DOM-based HTML Injection occurs when JavaScript takes attacker-controlled data and inserts it into an HTML sink.

Dangerous examples include:

```javascript
element.innerHTML = userInput;
```

```javascript
document.write(userInput);
```

```javascript
document.writeln(userInput);
```

OWASP specifically identifies `innerHTML` and `document.write()` as potentially dangerous when untrusted data is used without appropriate protection.

---

## Example

Vulnerable:

```javascript
const name = location.search.substring(6);

document.getElementById("welcome").innerHTML =
    "Hello " + name;
```

Request:

```text
?page?name=<b>TEST</b>
```

Potential result:

```html
<div id="welcome">
    Hello <b>TEST</b>
</div>
```

The server does not necessarily need to reflect the value.

The browser-side JavaScript creates the vulnerability.

---

# 18. Stored HTML Injection

Stored injection deserves special attention in bug bounty programs.

Typical flow:

```text
Attacker
   |
   v
Input
   |
   v
Application
   |
   v
Database
   |
   v
Victim visits page
   |
   v
Injected HTML rendered
```

Examples:

```text
Profile name
Comment
Project description
Support ticket
Organization name
Team name
Document title
```

---

## Stored Injection Testing Method

### Step 1

Choose a harmless marker:

```text
HTML-STORED-123
```

### Step 2

Submit it.

### Step 3

Navigate away.

### Step 4

Return to the page.

### Step 5

Check whether it remains.

### Step 6

Test harmless HTML:

```html
<b>HTML-STORED-123</b>
```

### Step 7

Check whether another account sees it.

Only test cross-user behavior when explicitly permitted by the program.

---

# 19. Reflected HTML Injection

Reflected injection usually looks like:

```text
GET /search?q=PAYLOAD
```

and:

```html
<h2>Search results for PAYLOAD</h2>
```

The important characteristic is:

```text
Request
  ↓
Server
  ↓
Response
  ↓
Browser
```

The payload is not necessarily stored.

---

## Reflected Injection Checklist

For every parameter:

```text
Does my value appear in the response?
        |
        +-- No → probably not reflected here
        |
        +-- Yes
             |
             v
Where does it appear?
             |
             +-- HTML text
             +-- Attribute
             +-- URL
             +-- JavaScript
             +-- CSS
```

This workflow is far more useful than blindly trying payload lists.

---

# 20. HTML Injection Through APIs

Modern bug hunters should pay special attention to APIs.

Imagine:

```http
PUT /api/profile
Content-Type: application/json
```

```json
{
  "fullname": "<b>TEST</b>"
}
```

The API may respond:

```json
{
  "success": true
}
```

This does not prove there is no vulnerability.

The value may be stored and later displayed:

```text
Profile
Admin panel
Team members
Comments
Notifications
Email templates
Audit logs
```

Therefore:

> Always follow data through the application.

A value that appears harmless in an API response may become dangerous when another frontend renders it.

---

# 21. HTML Injection in Modern Applications

Modern applications frequently use:

```text
React
Vue
Angular
Svelte
Next.js
Nuxt
jQuery
Custom JavaScript
Server-side templates
```

Frameworks can provide automatic escaping, but developers can still introduce dangerous behavior.

Pay attention to:

```javascript
innerHTML
outerHTML
insertAdjacentHTML
document.write
```

and framework-specific raw HTML features.

For example, React has mechanisms for intentionally rendering raw HTML.

The important question is not:

> "Is this React?"

The important question is:

> "Where does this value eventually become HTML?"

---

# 22. Testing Methodology With Burp Suite

Burp Suite is extremely useful for HTML Injection testing.

A simple workflow:

```text
Browser
   |
   v
Burp Proxy
   |
   v
Application
```

---

## Step 1 — Find an Input

For example:

```text
GET /search?q=test
```

---

## Step 2 — Send to Repeater

Right-click:

```text
Send to Repeater
```

---

## Step 3 — Change the Value

Start:

```text
test
```

to:

```text
HTMLTEST123
```

Send the request.

---

## Step 4 — Search the Response

Use:

```text
HTMLTEST123
```

Find where it appears.

---

## Step 5 — Test HTML

Try:

```html
<b>HTMLTEST123</b>
```

---

## Step 6 — Inspect the Rendered Result

Do not rely only on the raw HTTP response.

Check:

```text
Response
DOM
Rendered page
Browser behavior
Network requests
```

---

# 23. Finding the Injection Context

This is the workflow I recommend for beginners.

Suppose your marker is:

```text
INJECT123
```

You find:

```html
<div class="result">
    INJECT123
</div>
```

Context:

```text
HTML BODY
```

Now imagine:

```html
<input value="INJECT123">
```

Context:

```text
ATTRIBUTE
```

Another example:

```html
<a href="/search?q=INJECT123">
```

Context:

```text
URL ATTRIBUTE
```

Another:

```html
<script>
const query = "INJECT123";
</script>
```

Context:

```text
JAVASCRIPT
```

Do not use the same payload for every context.

---

# 24. Understanding Encoding

Encoding is one of the most important concepts in web security.

Suppose the application receives:

```text
<b>TEST</b>
```

and outputs:

```html
&lt;b&gt;TEST&lt;/b&gt;
```

The browser displays:

```text
<b>TEST</b>
```

as text.

The browser does not interpret it as a `<b>` element in that HTML text context.

OWASP recommends context-specific output encoding rather than applying one generic encoding strategy everywhere.

---

# 25. HTML Entity Encoding

Important characters include:

| Character | HTML Encoding |
| --------- | ------------- |
| `&`       | `&amp;`       |
| `<`       | `&lt;`        |
| `>`       | `&gt;`        |
| `"`       | `&quot;`      |
| `'`       | `&#x27;`      |

For example:

```text
<b>TEST</b>
```

becomes:

```text
&lt;b&gt;TEST&lt;/b&gt;
```

OWASP documents HTML entity encoding as the appropriate technique for values inserted into ordinary HTML contexts.

---

# 26. Filter and WAF Testing

Many beginner hunters make this mistake:

```text
<script>...</script>
```

gets blocked.

They conclude:

```text
Not vulnerable.
```

That is not necessarily correct.

A filter may block one pattern while allowing HTML Injection.

For example:

```html
<script>
```

might be rejected while:

```html
<b>TEST</b>
```

still works.

Qualys specifically discusses weak filters that look for obvious strings such as `<script>` or `alert`, while other HTML structures remain injectable.

---

## What to Test

Instead of testing only one payload, test categories:

```text
Simple element
Attribute
Closing tag
Quote
HTML entity
URL
Form
Base
```

Your objective is to understand:

```text
What characters are encoded?
What tags are allowed?
What attributes are allowed?
Is input transformed?
Is it stripped?
Is it stored?
Does the browser parse it differently?
```

---

# 27. Common Developer Mistakes

## Mistake 1 — String concatenation

Example:

```javascript
output.innerHTML = "<div>" + username + "</div>";
```

If `username` is untrusted, this can be dangerous.

---

## Mistake 2 — Trusting client-side validation

JavaScript may say:

```text
Invalid characters!
```

But the server might accept them directly.

Always test the actual HTTP request.

---

## Mistake 3 — Blacklisting `<script>`

Blocking:

```text
<script>
```

does not solve HTML Injection.

HTML contains hundreds of elements and attributes.

---

## Mistake 4 — Encoding only some characters

For example:

```text
< encoded
> encoded
" not encoded
```

An attribute context may still be vulnerable.

---

## Mistake 5 — Encoding too early

Encoding should be appropriate for the final output context.

OWASP and PortSwigger both emphasize context-specific output encoding.

---

# 28. Impact Assessment

HTML Injection can have different impacts.

## Low-impact example

```html
<b>Injected</b>
```

Only changes visual formatting.

---

## Higher-impact example

Stored HTML changes a public page:

```text
Defacement
False content
Fake announcements
```

---

## Higher-impact example

An attacker can inject:

```html
<form>
```

and create a convincing fake interface.

---

## Higher-impact example

Base Tag Injection changes where relative resources resolve.

---

## Potential escalation

HTML Injection can sometimes become:

```text
HTML Injection
      ↓
DOM manipulation
      ↓
Resource loading
      ↓
Script execution
      ↓
XSS
```

But you must prove each step.

Do not automatically claim the highest possible impact.

---

# 29. When HTML Injection Becomes XSS

This distinction matters greatly in bug bounty reports.

Suppose:

```html
<b>TEST</b>
```

works.

That proves:

```text
HTML Injection
```

It does **not** automatically prove:

```text
XSS
```

If you discover that the same injection context allows attacker-controlled JavaScript execution, then the vulnerability should generally be evaluated as XSS rather than merely HTML Injection.

PortSwigger's XSS testing material demonstrates why the exact context determines whether a markup injection can progress into script execution.

---

# 30. HTML Injection and CSRF

HTML Injection can sometimes interact with CSRF protections.

For example, applications often place CSRF tokens inside forms:

```html
<input
    type="hidden"
    name="csrf"
    value="TOKEN">
```

If HTML Injection allows an attacker to manipulate the form structure, the security assumptions around that form may change.

Invicti documents scenarios where HTML Injection can potentially expose CSRF tokens or facilitate CSRF-related attacks.

However:

> Do not claim "CSRF bypass" simply because HTML Injection exists.

You need to demonstrate the actual security boundary being bypassed.

---

# 31. HTML Injection and Password Managers

Modern browsers and password managers may interact with HTML forms.

If an attacker can create or manipulate a form on a trusted origin, browser autofill behavior can become relevant.

Invicti notes that injected forms can potentially interact with browser password managers depending on the browser, form structure, and autofill behavior.

For responsible testing:

```text
Use test credentials.
Never collect real user passwords.
Never test against users you do not control.
```

---

# 32. HTML Injection and Phishing

HTML Injection can make an attacker-controlled interface appear inside a trusted origin.

For example:

```text
https://target.example/account
```

could potentially display attacker-controlled HTML.

This matters because the browser address bar may still show:

```text
target.example
```

even though the injected interface is controlled by the attacker.

Possible consequences include:

```text
Fake login forms
Fake payment prompts
Fake password reset forms
Fake security warnings
Fake account notifications
```

Invicti and CDNetworks both identify phishing, page manipulation, and deceptive content as potential consequences.

---

# 33. How to Confirm a Real Vulnerability

A good bug hunter should prove three things.

## 1. Input Control

Can you control the value?

Example:

```text
?q=HTMLTEST
```

---

## 2. HTML Interpretation

Does the browser interpret your input as HTML?

Example:

```html
<b>HTMLTEST</b>
```

renders as bold.

---

## 3. Security Impact

What can you actually accomplish?

Possible levels:

```text
Visual modification
        ↓
HTML structure manipulation
        ↓
User interaction manipulation
        ↓
Form manipulation
        ↓
Resource manipulation
        ↓
Cross-user stored impact
        ↓
Potential XSS / other escalation
```

Report the **highest impact you can demonstrate**, not the highest impact you can imagine.

---

# 34. False Positives

Finding your payload in the response is not enough.

Example:

```html
<div>
    &lt;b&gt;TEST&lt;/b&gt;
</div>
```

This is probably just encoded text.

Another example:

```html
<textarea>
<b>TEST</b>
</textarea>
```

The string exists in the response, but it is not necessarily parsed as an HTML element.

Another example:

```html
<!-- <b>TEST</b> -->
```

Again, it is not being rendered as normal HTML.

Qualys explicitly warns that scanners cannot simply search for strings such as `<script>` or `alert()`; they need to determine whether the payload actually changes the document structure or produces exploitable browser behavior.

---

# 35. Bug Bounty Severity

Severity depends on context and impact.

Consider:

| Situation                     | Typical Impact Consideration         |
| ----------------------------- | ------------------------------------ |
| Reflected visual HTML only    | Usually limited                      |
| Stored visual HTML            | More significant                     |
| Public page defacement        | Higher impact depending on audience  |
| HTML can manipulate forms     | Potentially significant              |
| HTML affects privileged users | Potentially significant              |
| Base Tag Injection            | Context-dependent                    |
| HTML Injection → XSS          | Report as XSS if proven              |
| HTML Injection → CSRF impact  | Depends on demonstrated bypass       |
| Credential phishing           | Depends on realistic victim exposure |

Do not blindly assign:

```text
Critical
```

because an HTML tag works.

Bug bounty programs have different severity standards.

Always read the program's policy.

---

# 36. Writing the Bug Report

A good report should be reproducible.

Use this structure:

```markdown
# HTML Injection in [Parameter]

## Summary

The `[parameter]` parameter is vulnerable to HTML Injection.
Attacker-controlled HTML is rendered as markup in the affected page.

## Steps to Reproduce

1. Open [URL].
2. Navigate to [feature].
3. Submit the following value:

<b>HTMLTEST</b>

4. Observe that the value is rendered as HTML.
5. Inspect the resulting page.

## Payload

<b>HTMLTEST</b>

## Expected Result

User-controlled input should be rendered as text.

## Actual Result

The application renders the attacker-controlled input as HTML.

## Impact

An attacker can modify the rendered page content and potentially
manipulate the interface presented to users.

## Remediation

Apply context-appropriate output encoding and sanitize HTML only
where HTML is intentionally allowed.
```

---

# 37. Remediation

The primary defense is:

> Treat untrusted data as data, not markup.

OWASP recommends context-specific output encoding, appropriate input validation, and safe DOM APIs.

---

# 38. Developer-Side Secure Coding

## Unsafe

```javascript
element.innerHTML = username;
```

## Safer

```javascript
element.textContent = username;
```

`textContent` treats the value as text rather than HTML.

OWASP specifically recommends safe sinks such as `textContent` when HTML is not intentionally required.

---

## Server-Side Example

Instead of:

```html
<div>{{ user_input }}</div>
```

where the template engine may allow raw HTML, use the framework's normal escaped output mechanism.

Modern frameworks frequently provide automatic escaping.

The important rule is:

> Do not disable automatic escaping unless you actually need to render trusted/sanitized HTML.

---

# 39. HTML Sanitization

Sometimes an application genuinely needs users to submit HTML.

Examples:

```text
Rich-text editor
Blog editor
Documentation editor
Markdown renderer
Email template editor
```

In those situations, simply escaping everything may break the application's functionality.

Instead, use a mature HTML sanitizer with an allowlist.

For example:

```text
Allowed tags:
p
b
i
strong
em
ul
ol
li
```

Potentially forbidden:

```text
script
iframe
object
embed
base
event-handler attributes
dangerous URL schemes
```

The exact policy depends on the application.

Do not write your own HTML sanitizer unless there is a very strong reason.

---

# 40. Content Security Policy

CSP is useful defense-in-depth.

Example:

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    object-src 'none';
    base-uri 'self';
```

The:

```text
base-uri
```

directive is particularly relevant to Base Tag Injection.

CSP should not be considered the primary fix for HTML Injection.

The correct approach remains:

```text
Context-aware output encoding
+
Input validation
+
Sanitization when HTML is intentionally allowed
+
CSP as defense-in-depth
```

Invicti specifically warns against relying on CSP as a complete HTML Injection defense.

---

# 41. Testing Checklist

Use this checklist during bug hunting.

## Discovery

```text
[ ] Search parameters
[ ] POST parameters
[ ] JSON fields
[ ] Path parameters
[ ] Profile fields
[ ] Comments
[ ] Names
[ ] Descriptions
[ ] Titles
[ ] Tickets
[ ] Notifications
[ ] API fields
[ ] WebSocket messages
[ ] URL fragments
```

## Reflection

```text
[ ] Does my marker appear?
[ ] Is it reflected immediately?
[ ] Is it stored?
[ ] Is it reflected elsewhere?
```

## Context

```text
[ ] HTML body
[ ] Attribute
[ ] href
[ ] src
[ ] Form
[ ] JavaScript
[ ] CSS
[ ] DOM sink
```

## Encoding

```text
[ ] <
[ ] >
[ ] "
[ ] '
[ ] &
```

Check whether they are:

```text
Encoded
Removed
Normalized
Decoded
Double-decoded
```

## HTML

```text
[ ] <b>
[ ] <i>
[ ] <div>
[ ] <span>
[ ] <h1>
[ ] <a>
[ ] <img>
[ ] <form>
[ ] <base>
```

## Impact

```text
[ ] Visual modification
[ ] Stored impact
[ ] Cross-user impact
[ ] Form manipulation
[ ] Resource loading
[ ] Base URL manipulation
[ ] Possible XSS escalation
[ ] Possible CSRF interaction
```

---

# 42. Beginner Bug Hunter Workflow

Here is the workflow I recommend memorizing.

```text
                 FIND INPUT
                     |
                     v
              INSERT MARKER
                     |
                     v
              FIND REFLECTION
                     |
                     v
           IDENTIFY HTML CONTEXT
                     |
        +------------+-------------+
        |            |             |
        v            v             v
      BODY       ATTRIBUTE        URL
        |            |             |
        +------------+-------------+
                     |
                     v
             TEST SIMPLE HTML
                     |
                     v
          DOES BROWSER PARSE IT?
               /             \
             NO               YES
             |                 |
             v                 v
        Investigate       Confirm HTML
        encoding/filter   Injection
                               |
                               v
                       Determine impact
                               |
                               v
                       Check stored/reflected
                               |
                               v
                       Test escalation safely
                               |
                               v
                          Write report
```

---

# 43. Advanced Testing Ideas

Once you understand basic HTML Injection, start thinking in terms of **parsing contexts**, not payload lists.

## 43.1 Context transitions

Ask:

```text
Can I move from text context to attribute context?
```

For example:

```html
<div>INPUT</div>
```

versus:

```html
<input value="INPUT">
```

---

## 43.2 Tag termination

Determine whether the application allows structural characters to terminate the current element.

---

## 43.3 Attribute injection

Test whether you can introduce additional attributes.

---

## 43.4 URL manipulation

Determine whether attacker-controlled data becomes:

```text
href
src
action
poster
cite
```

or other URL-bearing attributes.

---

## 43.5 Base URL manipulation

Check whether:

```html
<base>
```

is accepted and whether the application relies heavily on relative URLs.

---

## 43.6 DOM sinks

Search JavaScript for:

```javascript
innerHTML
outerHTML
insertAdjacentHTML
document.write
document.writeln
```

Then trace the data source.

Potential sources include:

```javascript
location.search
location.hash
location.pathname
document.referrer
postMessage
localStorage
sessionStorage
```

The key is the complete data flow:

```text
SOURCE → TRANSFORMATION → SINK
```

---

# 44. Useful Tools

## Burp Suite

Useful for:

```text
Intercepting requests
Repeater
Intruder
Searching responses
Modifying parameters
Testing APIs
```

## Browser DevTools

Use:

```text
Elements
Network
Sources
Console
Application
```

The **Elements** panel is particularly useful because it shows the browser's parsed DOM.

Compare:

```text
HTTP Response
```

with:

```text
Rendered DOM
```

They may not be identical.

---

## Browser View Source

Use:

```text
View Source
```

to inspect the original HTML response.

Then compare it with:

```text
Elements
```

This can help identify browser parsing behavior.

---

# 45. Final Cheat Sheet

## Definition

```text
HTML Injection =
Attacker-controlled input
+
Unsafe HTML rendering
```

---

## Main Types

```text
Reflected
Stored
DOM-based
```

---

## First Payload

```html
<b>TEST</b>
```

---

## Other Safe Tests

```html
<i>TEST</i>
```

```html
<h1>TEST</h1>
```

```html
<div>TEST</div>
```

```html
<a href="/test">TEST</a>
```

---

## Main Question

Always ask:

> Where does my input land?

---

## Contexts

```text
HTML
Attribute
URL
JavaScript
CSS
DOM
```

---

## Dangerous Sinks

```javascript
innerHTML
outerHTML
insertAdjacentHTML
document.write
document.writeln
```

---

## Interesting HTML Elements

```text
<form>
<a>
<img>
<iframe>
<base>
```

---

## Base Tag

```html
<base href="https://controlled.example/">
```

Remember:

```text
<base>
      ↓
Changes resolution of relative URLs
```

---

## Encoding

```text
<  → &lt;
>  → &gt;
"  → &quot;
'  → &#x27;
&  → &amp;
```

---

## Detection Logic

```text
Marker reflected?
        |
        v
Where?
        |
        v
HTML context?
        |
        v
HTML interpreted?
        |
        v
Stored or reflected?
        |
        v
What impact?
        |
        v
Can it escalate?
```

---

## Reporting Rule

Never say:

```text
XSS
```

just because:

```html
<b>TEST</b>
```

works.

Instead say:

```text
HTML Injection
```

unless you have demonstrated actual script execution or another condition that makes it an XSS finding.

---

# 46. References

### OWASP

* OWASP Web Security Testing Guide — Testing for HTML Injection.
* OWASP Cross-Site Scripting Prevention Cheat Sheet.
* OWASP DOM-Based XSS Prevention guidance.

### PortSwigger

* XSS Contexts and understanding injection contexts.
* XSS Prevention and context-specific output encoding.
* XSS Cheat Sheet.

### CWE

* CWE-79 — Improper Neutralization of Input During Web Page Generation.

### Invicti

* HTML Injection — Learn.
* HTML Injection — Vulnerability Database.

### Qualys

* Finding HTML Injection Vulnerabilities, Part I.

### Punk Security

* Base Tag HTML Injection: A Guide for Pentesters.

### CDNetworks

* HTML Injection Glossary.

### Wallarm

* HTML Injection — Mitigation and Prevention.

---

# The Most Important Lesson

If you are a beginner bug hunter, **do not memorize hundreds of HTML Injection payloads**.

Learn to answer these five questions:

```text
1. Can I control the input?

2. Where exactly does my input appear?

3. Is the input encoded or interpreted as HTML?

4. Is the injection reflected, stored, or DOM-based?

5. What security impact can I actually demonstrate?
```

Once you can answer those five questions, HTML Injection becomes much easier to find.

The real skill is not:

```text
"I know a payload."
```

The real skill is:

```text
"I understand how the browser parses my input,
what context I am in, what the application does
to my input, and what security boundary I can affect."
```

That mindset is what allows a beginner bug hunter to move from simple:

```html
<b>TEST</b>
```

to understanding complex cases involving attributes, forms, APIs, DOM manipulation, Base Tag Injection, stored data, and possible XSS escalation.