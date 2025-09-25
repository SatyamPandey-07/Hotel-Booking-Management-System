package com.example.hotelbooking.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.hotelbooking.model.Customer;

@Repository
public class CustomerDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Customer> getAllCustomers() {
        String sql = "SELECT * FROM customers";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Customer c = new Customer();
            c.setId(rs.getInt("id"));
            c.setName(rs.getString("name"));
            c.setEmail(rs.getString("email"));
            c.setPassword(rs.getString("password"));
            return c;
        });
    }

    public void addCustomer(Customer customer) {
        String sql = "INSERT INTO customers(name, email, password) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, customer.getName(), customer.getEmail(), customer.getPassword());
    }

    public Customer getCustomerById(int id) {
        String sql = "SELECT * FROM customers WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Customer c = new Customer();
                c.setId(rs.getInt("id"));
                c.setName(rs.getString("name"));
                c.setEmail(rs.getString("email"));
                c.setPassword(rs.getString("password"));
                return c;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateCustomer(Customer customer) {
        String sql = "UPDATE customers SET name = ?, email = ?, password = ? WHERE id = ?";
        jdbcTemplate.update(sql, customer.getName(), customer.getEmail(), customer.getPassword(), customer.getId());
    }

    public void deleteCustomer(int id) {
        String sql = "DELETE FROM customers WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}