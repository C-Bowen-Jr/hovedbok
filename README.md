# Hovedbok

"Hovedbok" is Norwegian for "ledger". Hovedbok is an open source version of my in house built ledger software. It differs in that this version has features that make useage easier for an end user. Compared to my own which is built exactly what I need it for and nothing more.

## Using Hovedbok

There is a user guide available in the repository under ```hovedbok/user-guide/src/SUMMARY.md``` that will cover just about everything.

## Cross Platform

Currently, the available binary for Windows works just as well as if built from the source code. However, the Linux version is troubled by relative paths, so the .deb bundle is not working reliably to release. That said, when compiled, the executable in target/release will run fine. MacOS is currently untested at this point.

## Why Choose This Solution?

Hovedbok is the 4th iteration of my personal ledger maintaing software. With that I've refined what works to a streamlined effect. The point from the start was to ensure data accuracy and minimize work. Along with UI/UX improvements, I've also improved database entries to be simple and efficent. This way, those using Version 1.X.X builds can create SQL searches without complicated queries.