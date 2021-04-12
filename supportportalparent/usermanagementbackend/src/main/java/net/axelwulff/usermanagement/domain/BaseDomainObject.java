package net.axelwulff.usermanagement.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.io.Serializable;
import java.util.Set;

public abstract class BaseDomainObject implements Serializable {

    @JsonIgnore
    private final Validator validator;

    public BaseDomainObject() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    public Set<ConstraintViolation<BaseDomainObject>> validate() {
        return validator.validate(this);
    }
}
