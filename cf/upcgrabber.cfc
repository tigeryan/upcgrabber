<cfcomponent>
	<cffunction name="saveHTML" access="remote" returnformat="JSON">
		<cfargument name="theUPC" type="string" default="nada" />
		<cfargument name="theHTML" type="string" default="nada" />
		<cfset local.theHTML = binaryDecode(arguments.theHTML,'base64') />
		<cffile action="write" file="./upcs/#arguments.theUPC#.html" output="#local.theHTML#" />
		<cfreturn 1>
	</cffunction>
</cfcomponent>
