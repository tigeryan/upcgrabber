<cftry>
	<cfdirectory name="getUPC" directory="d:\grab\upcs\" filter="*.html" />
	<cfcatch type="any"><cfdump var="#cfcatch#"><cfabort></cfcatch>
</cftry>
<!--- d:\grab\upcs\

<cfoutput>#ExpandPath("./upcs/")#</cfoutput>

<cfdump var="#getUPC#" />
<cfdump var="#cgi#" />
--->

<cfif getUPC.recordcount>

	<cfset returnQuery = queryNew("upc,vendor,price,shipping,url","varchar, varchar, varchar, varchar, varchar") />

	<cfloop query="getUPC">

		<cffile action="read" file="d:\grab\upcs\#getUPC.name#" variable="html" />

		<!---<cfoutput>#html#</cfoutput>--->

		<cfset html = ReplaceNoCase(html,"g-expandable-content","div","ALL") />

		<!--- PRICE <span class="_kh">$299.95</span> --->
		<!--- VENDOR <span class="rhsg4">eBay</span> --->
		<!--- SHIPPING <span class="rhsg4" style="text-transform:lowercase">Free shipping, no tax</span> --->
		<!--- URL <a class="plantl" href="http://www.ebay.com/itm/like/232626421149" id="vjpm0" onmousedown="return google.arwt(this)" ontouchstart="return google.arwt(this)"> --->


		<cfset loopstart = 1 />

		<cfloop condition="#FindNoCase('<div class="_Dw',html,loopstart)#">

			<cfset start = FindNoCase('<div class="_Dw',html, loopstart) />

			<cfset end = FindNocase('</div>',html,start) />

			<cfset product = Mid(html,start,end-start+5) />

			<!---<cfoutput>#start# - #end#</cfoutput>--->

			<!---<cfoutput><xmp>|#product#|</xmp></cfoutput>--->

			<cfset loopstart = end />

			<!---<cfoutput>#FindNoCase('<div class="_Dw"',html,loopstart)#</cfoutput><br />--->

			<cfset startPrice = FindNoCase('<span class="_kh">',product) />
			<cfset endPrice = FindNoCase('</span>',product,startPrice) />
			<cfset price = Mid(product,startPrice+18,endPrice-startPrice-18) />
			<!---<cfoutput><xmp>Price:|#price#|</xmp></cfoutput>--->

			<cfset startVendor = FindNoCase('<span class="rhsg4">',product) />
			<cfset endVendor = FindNoCase('</span>',product,startVendor) />
			<cfset vendor = Mid(product,startVendor+20,endVendor-startVendor-20) />

			<!---<cfoutput><xmp>Vendor|#vendor#|</xmp></cfoutput>--->

			<cfset startShipping = FindNoCase('<span class="_ree">',product) />
			<cfset endShipping = FindNoCase('</span>',product,startShipping) />
			<cfset shipping = Mid(product,startShipping+19,endShipping-startShipping-19) />
			<cfset shipping = stripHTML(shipping) />

			<!---<cfoutput><xmp>Shipping|#shipping#|</xmp></cfoutput>--->

			<cfset startURL = FindNoCase('<a class="plantl" href="',product) />
			<cfset endURL = FindNoCase('"',product,startURL+25) />
			<cfset theURL = Mid(product,startURL+24,endURL-startURL-24) />

			<!---<cfoutput><xmp>The URL|#theURL#|</xmp></cfoutput>--->

			<cfset queryAddRow(returnQuery) />
			<cfset querySetCell(returnQuery,"upc",ListGetAt(getUPC.name,1,"."), returnQuery.recordcount) />
			<cfset querySetCell(returnQuery,"vendor",vendor, returnQuery.recordcount) />
			<cfset querySetCell(returnQuery,"price",price, returnQuery.recordcount) />
			<cfset querySetCell(returnQuery,"shipping",shipping, returnQuery.recordcount) />
			<cfset querySetCell(returnQuery,"url",theURL, returnQuery.recordcount) />

		</cfloop>

	</cfloop>

<cfoutput>#SerializeJSON(returnQuery)#</cfoutput>


<cfscript>
/**
 * Removes HTML from the string.
 * v2 - Mod by Steve Bryant to find trailing, half done HTML.
 * v4 mod by James Moberg - empties out script/style blocks
 * v5 mod by dolphinsboy
 *
 * @param string      String to be modified. (Required)
 * @return Returns a string.
 * @author Raymond Camden (ray@camdenfamily.com)
 * @version 4, October 4, 2010
 */
function stripHTML(str) {
    // remove the whole tag and its content
    var list = "style,script,noscript";
    for (var tag in list){
        str = reReplaceNoCase(str, "<s*(#tag#)[^>]*?>(.*?)","","all");
    }

    str = reReplaceNoCase(str, "<.*?>","","all");
    //get partial html in front
    str = reReplaceNoCase(str, "^.*?>","");
    //get partial html at end
    str = reReplaceNoCase(str, "<.*$","");

    return trim(str);

}
</cfscript>







</cfif>
