using src.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace src.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<UserAccount, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

       public DbSet<Language> Languages { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Exercise> Exercises { get; set; }

        public DbSet<Word> Words { get; set; }
        public DbSet<LessonWord> LessonWords { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }

        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
         public DbSet<UserAccount> UserAccounts { get; set; }


         

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
          

            // Unique constraints
            modelBuilder.Entity<UserCourse>().HasIndex(x => new { x.UserId, x.CourseId }).IsUnique();
            modelBuilder.Entity<UserAchievement>().HasIndex(x => new { x.UserId, x.AchievementId }).IsUnique();
            modelBuilder.Entity<LessonWord>().HasIndex(x => new { x.LessonId, x.WordId }).IsUnique();

            modelBuilder.Entity<Course>()
                .HasOne(c => c.FromLanguage)
                .WithMany()
                .HasForeignKey(c => c.FromLanguageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.ToLanguage)
                .WithMany()
                .HasForeignKey(c => c.ToLanguageId)
                .OnDelete(DeleteBehavior.Restrict);


           modelBuilder.Entity<UserProfile>()
                .HasOne(p => p.UserAccount)
                .WithOne(a => a.Profile)
                .HasForeignKey<UserProfile>(p => p.UserAccountId)
                .OnDelete(DeleteBehavior.Cascade);


            // Permission
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("Permissions");

                entity.HasKey(p => p.PermissionId);

                entity.Property(p => p.Name)
                
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(p => p.Description)
                    .HasMaxLength(255);
            });



            // RolePermission (bảng trung gian)
            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.ToTable("RolePermissions");

                entity.HasKey(rp => new { rp.RoleId, rp.PermissionId });

                // Quan hệ với Role (IdentityRole không có RolePermissions)
                entity.HasOne(rp => rp.Role)
                
                    .WithMany()
                    .HasForeignKey(rp => rp.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Quan hệ với Permission
                entity.HasOne(rp => rp.Permission)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(rp => rp.PermissionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure RefreshToken
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Token)
                      .HasColumnType("nvarchar(500)")
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.UserAccountId)
                    .IsRequired();

                entity.HasIndex(e => e.Token)
                    .IsUnique();

                entity.HasIndex(e => new { e.UserAccountId, e.Token });

                // Relationship
                entity.HasOne(e => e.UserAccounts)
                    .WithMany()
                    .HasForeignKey(e => e.UserAccountId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
              base.OnModelCreating(modelBuilder);

        }
    }
}