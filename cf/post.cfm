<cfparam name="form.theHTML" default="Nada" />
<cfparam name="form.theUPC" default="Nada" />

<cfsavecontent variable="stuff">
<cfdump var="#form#" />
</cfsavecontent>

<cffile action="write" file="d:/grab/upcs/#form.theUPC#.html" output="#now()# - #stuff# - #form.theHTML#" />
