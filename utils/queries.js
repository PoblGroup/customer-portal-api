const occupiersResponsible = occupancyId => {
    return `<fetch distinct="true" >
        <entity name="contact" >
            <attribute name="contactid" />
            <attribute name="fullname" />
            <link-entity name="pobl_contact_pobl_occupancycontract_leadoccu" to="contactid" from="contactid" alias="L" link-type="outer" >
                <link-entity name="pobl_occupancycontract" to="pobl_occupancycontractid" from="pobl_occupancycontractid" alias="OCL" link-type="outer" />
            </link-entity>
            <filter>
                <condition entityname="OCL" attribute="pobl_occupancycontractid" operator="eq" value='${occupancyId}' />
            </filter>
        </entity>
    </fetch>`
}

const occupiersAdditional = occupancyId => {
    return `<fetch distinct="true" >
        <entity name="contact" >
            <attribute name="contactid" />
            <attribute name="fullname" />
            <link-entity name="pobl_contact_pobl_occupancycontract_addition" to="contactid" from="contactid" alias="A" link-type="outer" >
            <link-entity name="pobl_occupancycontract" to="pobl_occupancycontractid" from="pobl_occupancycontractid" alias="OCA" link-type="outer" />
            </link-entity>
            <filter>
                <condition entityname="OCA" attribute="pobl_occupancycontractid" operator="eq" value="${occupancyId}" />
            </filter>
        </entity>
    </fetch>`
}

const propertyHazards = propertyId => {
    return `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="pobl_hazard">
      <attribute name="pobl_hazardid" />
      <attribute name="pobl_name" />
      <attribute name="pobl_hazardref" />
      <attribute name="pobl_hazardtype" />
      <attribute name="pobl_hazardstatus" />
      <attribute name="pobl_hazardimpact" />
      <attribute name="createdon" />
      <order attribute="pobl_name" descending="false" />
      <filter type="and">
        <condition attribute="pobl_hazardpropertyid" operator="eq" uitype="pobl_property" value="${propertyId}" />
        <condition attribute="pobl_hazardshowonportal" operator="eq" value="1" />
      </filter>
    </entity>
  </fetch>`
}

const propertyCertificates = propertyId => {
    return `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
        <entity name="pobl_certificate">
        <attribute name="pobl_certificateid" />
        <attribute name="pobl_name" />
        <attribute name="createdon" />
        <attribute name="pobl_issueddate" />
        <attribute name="pobl_certificatetypeid" />
        <attribute name="pobl_certificatestart" />
        <attribute name="pobl_certificatereview" />
        <attribute name="pobl_certificateexpires" />
        <attribute name="pobl_certificatesupplier" />
        <attribute name="statecode" />
        <order attribute="pobl_name" descending="false" />
        <filter type="and">
            <condition attribute="pobl_propertyid" operator="eq" uitype="pobl_property" value="${propertyId}" />
            <condition attribute="pobl_certificateonportal" operator="eq" value="1" />
            <condition attribute="statecode" operator="eq" value="0" />
        </filter>
        </entity>
    </fetch>`
}

module.exports = { 
    occupiersAdditional, 
    occupiersResponsible,
    propertyHazards,
    propertyCertificates,
}