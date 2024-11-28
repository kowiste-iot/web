// main.go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite" // Changed to SQLite
	"gorm.io/gorm"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"full_name" binding:"required" gorm:"not null"`
	Email     string    `json:"email" binding:"required,email" gorm:"unique;not null"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	Role      string    `json:"role" binding:"required,oneof=admin user guest"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserRequest struct {
	Name     string `json:"full_name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	IsActive bool   `json:"is_active"`
	Role     string `json:"role" binding:"required,oneof=admin user guest"`
}

type UpdateUserRequest struct {
	Name     *string `json:"full_name" binding:"omitempty"`
	Email    *string `json:"email" binding:"omitempty,email"`
	IsActive *bool   `json:"is_active"`
	Role     *string `json:"role" binding:"omitempty,oneof=admin user guest"`
}

type ApiResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Status  int         `json:"status"`
}

type UserHandler struct {
	db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	var users []User
	if err := h.db.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error fetching users",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Data:   users,
		Status: http.StatusOK,
	})
}

func (h *UserHandler) GetUser(c *gin.Context) {
	var user User
	if err := h.db.First(&user, c.Param("id")).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, ApiResponse{
				Message: "User not found",
				Status:  http.StatusNotFound,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error fetching user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Data:   user,
		Status: http.StatusOK,
	})
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	user := User{
		Name:     req.Name,
		Email:    req.Email,
		IsActive: req.IsActive,
		Role:     req.Role,
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error creating user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusCreated, ApiResponse{
		Data:   user,
		Status: http.StatusCreated,
	})
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	var user User
	if err := h.db.First(&user, c.Param("id")).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, ApiResponse{
				Message: "User not found",
				Status:  http.StatusNotFound,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error fetching user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	// Update only provided fields
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.Email != nil {
		user.Email = *req.Email
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}
	if req.Role != nil {
		user.Role = *req.Role
	}

	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error updating user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Data:   user,
		Status: http.StatusOK,
	})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	var user User
	if err := h.db.First(&user, c.Param("id")).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, ApiResponse{
				Message: "User not found",
				Status:  http.StatusNotFound,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error fetching user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	if err := h.db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Message: "Error deleting user",
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Message: "User deleted successfully",
		Status:  http.StatusOK,
	})
}

func setupRouter(handler *UserHandler) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// User routes
	users := r.Group("/api/users")
	{
		users.GET("", handler.GetUsers)
		users.GET("/:id", handler.GetUser)
		users.POST("", handler.CreateUser)
		users.PATCH("/:id", handler.UpdateUser)
		users.DELETE("/:id", handler.DeleteUser)
	}

	return r
}

func main() {
	// SQLite connection (will create a users.db file in your current directory)
	db, err := gorm.Open(sqlite.Open("users.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	if err := db.AutoMigrate(&User{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	handler := NewUserHandler(db)
	router := setupRouter(handler)

	log.Println("Server started on http://localhost:8080")
	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
