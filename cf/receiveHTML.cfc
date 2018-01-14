<cfcomponent>
	<cffunction name="getHTML" access="remote" returnformat="JSON">
		<cfargument name="theUPC" type="string" default="nada" />
		<cfargument name="theHTML" type="string" default="nada" />

		<cfsavecontent variable="stuff">
			<cfdump var="#arguments#" />
		</cfsavecontent>

		<cffile action="write" file="./#arguments.theUPC#.html" output="#now()# - #stuff# - #arguments.theHTML#" />
		<cfreturn 1>
	</cffunction>
</cfcomponent>