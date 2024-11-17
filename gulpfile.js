import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);
const browserSyncInstance = browserSync.create();

// Caminhos dos arquivos
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  fonts: {
    src: 'src/scss/fonts/*',
    dest: 'dist/css/fonts/'
  }
};

// Compilar Sass e minificar CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSyncInstance.stream());
}

// Minificar e concatenar JavaScript
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSyncInstance.stream());
}

// Copiar arquivos HTML para a pasta dist
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSyncInstance.stream());
}

// Otimizar e mover imagens
function images() {
  return gulp
    .src(paths.images.src, { encoding: false })  // Origem das imagens
    .pipe(gulp.dest(paths.images.dest))  // Destino das imagens otimizadas
    .pipe(browserSyncInstance.stream());  // Atualizar o navegador
}

function fonts() {
  return gulp
    .src(paths.fonts.src, { encoding: false })
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSyncInstance.stream());
}

// Iniciar o BrowserSync e assistir alterações
function serve() {
  browserSyncInstance.init({
    server: {
      baseDir: 'dist/'
    }
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.html.src, html).on('change', browserSyncInstance.reload);
  gulp.watch(paths.images.src, images);  // Assistir alterações nas imagens
}

// Exportar as tarefas para rodar via CLI
export { styles, scripts, html, images, fonts, serve };

// Tarefa padrão
export default gulp.series(gulp.parallel(styles, scripts, html, images, fonts), serve);