package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Docs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocsRepository extends  JpaRepository<Docs,Long>{

}
