/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package nl.dtls.fairdatapoint.metadata;

import java.util.List;
import org.openrdf.model.Statement;
import org.openrdf.model.URI;
import org.openrdf.rio.RDFFormat;

/**
 *
 * @author Rajaram Kaliyaperumal
 * @since 2016-08-24
 * @version 0.1
 */
public interface Metadata {
    
    URI getUri();
    List<Statement> getStatements();
    String toString(RDFFormat format) throws MetadataExeception;
    
}
