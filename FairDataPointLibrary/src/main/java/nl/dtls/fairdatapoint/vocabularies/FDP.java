/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package nl.dtls.fairdatapoint.vocabularies;

import org.openrdf.model.URI;
import org.openrdf.model.impl.URIImpl;

/**
 *
 * @author Rajaram Kaliyaperumal
 * @since 2016-08-24
 * @version 0.1
 */
public class FDP {
    public static final String BASE_URI = 
            "<http://www.dtls.nl/ontologies/fdpDummy/>";
    public static final URI API_VERSION = new URIImpl(BASE_URI + "APIVersion" );
    public static final URI CONTACT = new URIImpl(BASE_URI + "contact" );
}
