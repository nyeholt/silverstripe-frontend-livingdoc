# Frontend Livingdoc

A frontend site content editing tool built in top of the LivingDocs engine. 

Takes the lead from some of the work from https://github.com/wolfv/silverstripe-livingdocsfield 
and https://github.com/guru-digital/frontend-admin

## Getting started

The module ships with a 

## Limitations

The components in the current implemented design is based on Bootstrap 3, with the available components
all based on a specific implementation that _I_ needed at the time. This will be made more generic in future; the 
goal is that any Multisite or individual page instance can have a separate design file chosen; this will then 
allow different components to be put in place. 

For a workaround now, you can hook into the updateLivingdocsDesign JS event and change things there 
prior to it being loaded. See [docs/en/configuring-design.md](Configuring the design) for more. 