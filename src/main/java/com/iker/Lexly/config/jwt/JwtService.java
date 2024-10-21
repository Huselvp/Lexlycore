package com.iker.Lexly.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private  static final String SECRET_KEY= "413F4428472B4B6250655368566D5970337336763979244226452948404D6351";
    private static final long EXPIRATION_TIME= 5 * 60 * 60 * 1000;
    private static final long INACTIVITY_TIMEOUT = 5 * 60 * 1000;
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("lastActivity", new Date().getTime());
        return generateToken(claims, userDetails);
    }

    public String refreshToken(String token) {
        Claims claims = extractAllClaims(token);
        claims.put("lastActivity", new Date().getTime());
        return createToken(claims, extractUsername(token));
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token) && !isTokenExpiredDueToInactivity(token);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return createToken(extraClaims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // This will now use the correct expiration time in ms
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenExpiredDueToInactivity(String token) {
        long lastActivity = extractLastActivity(token);
        return (new Date().getTime() - lastActivity) > INACTIVITY_TIMEOUT;
    }

    private long extractLastActivity(String token) {
        return extractClaim(token, claims -> claims.get("lastActivity", Long.class));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // original code ****************

//    public String extractUsername(String token) {
//        return extractClaim(token,Claims::getSubject);
//    }
//    public  String generateToken(UserDetails userDetails){
//        return generateToken(new HashMap<>(),userDetails);
//    }
//    public<T> T extractClaim(String token, Function<Claims,T> claimsResolver){
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//    public String generateToken(Map<String,Object> extraClaims, UserDetails userDetails){
//
//        Date expirationDate= new Date(System.currentTimeMillis()+EXPIRATION_TIME);
//        return Jwts
//                .builder()
//                .setClaims(extraClaims).
//                setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(expirationDate)
//                .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact();
//    }
//    public boolean isTokenValid(String token ,UserDetails userDetails){
//        final String username = extractUsername(token);
//        return(username.equals(userDetails.getUsername())) && !isTokenExpired(token);
//    }
//
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token,Claims::getExpiration);
//    }
//
//    private Claims extractAllClaims(String token){
//        return Jwts.parser().setSigningKey(SECRET_KEY)
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public Boolean validateToken(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }

}

